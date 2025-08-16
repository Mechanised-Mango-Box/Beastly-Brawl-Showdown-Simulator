// TODO: make swappable instead of a global
import { Monster } from "../core/monster/monster";
import { Battle } from "../core/battle";
import { BlockedEvent, BuffEvent, DamageEvent, MoveEvadedEvent, MoveFailedEvent, MoveSuccessEvent, RerollEvent, RollEvent, StartMoveEvent } from "../core/event/core_events";
import { SideId } from "../core/side";
import { roll } from "../core/roll";
import { AbilityChargeStunComponent, DefendComponent, DodgeChargeComponent, DodgeStateComponent, RerollChargeComponent, StunnedStateComponent } from "../core/monster/core_components";
import { TargetingData, SingleEnemyTargeting, SelfTargeting } from "../core/action/targeting";
import { defineMove, getMoveId } from "../core/action/move/move";
import { MovePool, createMovePool } from "../core/action/move/move_pool";

export const commonMovePool: MovePool = createMovePool([
  defineMove("nothing", {
    type: "move",
    name: "Do nothing",
    description: "Do nothing...",
    priorityClass: 0,
    targetingMethod: "self",

    perform: async function (battle: Battle, source: SideId, targetingData: TargetingData) {
      throw new Error("This action should not be used EVER.");
    },
    onFail: async function (battle: Battle, source: SideId): Promise<void> {},
  }),

  defineMove("attack-normal", {
    type: "move",

    name: "Attack",
    description: "A regular attack.",
    icon: "wolverine-claws.svg",

    priorityClass: 0,
    targetingMethod: "single-enemy",

    perform: async function (battle: Battle, source: SideId, targetingData: SingleEnemyTargeting) {
      const sourceMonster: Monster = battle.sides[source].monster;
      const target: SideId = targetingData.target;
      const targetMonster: Monster = battle.sides[targetingData.target].monster;

      const startMoveEvent: StartMoveEvent = {
        name: "startMove",
        source: source,
        target: target,
        moveId: getMoveId(this),
      };
      battle.eventHistory.addEvent(startMoveEvent);

      //# Evade check
      const dodgeState: DodgeStateComponent | null = targetMonster.getComponent("dodging");
      if (dodgeState) {
        const moveEvadedEvent: MoveEvadedEvent = {
          name: "evaded",
          source: source,
          target: target,
          moveId: getMoveId(this),
        };
        battle.eventHistory.addEvent(moveEvadedEvent);
        return;
      }

      //# Roll
      await new Promise<void>((resolve) => {
        battle.noticeBoard.postNotice(source, {
          kind: "roll",
          data: { diceFaces: 20 },
          callback: function (): void {
            battle.noticeBoard.removeNotice(source, "roll");
            resolve();
          },
        });
      });
      let rollResult: number = roll(battle.rng,20);
      const rollEvent: RollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: rollResult,
      };
      battle.eventHistory.addEvent(rollEvent);

      // # Reroll
      const rerollComponent: RerollChargeComponent | null = sourceMonster.getComponent("reroll");
      if (rerollComponent && rerollComponent.charges > 0) {
        await new Promise<void>((resolve) => {
          battle.noticeBoard.postNotice(source, {
            kind: "rerollOption",
            data: { diceFaces: 20 },
            callback: function (shouldReroll: boolean): void {
              if (shouldReroll) {
                rerollComponent.charges--;
                rollResult = roll(battle.rng,20);
                const rerollEvent: RerollEvent = {
                  name: "reroll",
                  source: source,
                  faces: 20,
                  result: rollResult,
                };
                battle.eventHistory.addEvent(rerollEvent);
              }
              battle.noticeBoard.removeNotice(source, "rerollOption");
              resolve();
            },
          });
        });
      }

      //# Armour Check
      if (rollResult <= targetMonster.getArmourBonus()) {
        const blockedEvent: BlockedEvent = {
          name: "blocked",
          source: source,
          target: target,
        };
        battle.eventHistory.addEvent(blockedEvent);
        return;
      }

      const moveSuccessEvent: MoveSuccessEvent = {
        name: "moveSuccess",
        source: source,
        target: target,
        moveId: getMoveId(this),
      };
      battle.eventHistory.addEvent(moveSuccessEvent);

      //# Base damage roll
      const baseDamage: number = roll(battle.rng,4) + sourceMonster.baseID.baseStats.attack;

      //# Crit Check
      const critChanceBonus: number = sourceMonster.getCritChanceBonus();
      const critRollResult: number = roll(battle.rng, 20);
      const critRollEvent: RollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: critRollResult,
      };
      battle.eventHistory.addEvent(critRollEvent);
      //TODO -> change threshold (15) to something based on action / monster
      const critDamage: number = critChanceBonus + rollResult > 15 ? baseDamage : 0;

      const damageToTake: number = baseDamage + critDamage;
      targetMonster.health -= damageToTake;
      const damageEvent: DamageEvent = {
        name: "damage",
        source: source,
        target: target,
        amount: damageToTake,
      };
      battle.eventHistory.addEvent(damageEvent);
    },
    onHit: async function (battle: Battle, source: SideId, target: SideId): Promise<void> {
      // TODO
    },
    onFail: async function (battle: Battle, source: SideId): Promise<void> {},
  }),

  defineMove("defend", {
    type: "move",
    name: "Defend",
    description: "Increase your armor class temporarily.",
    icon: "vibrating-shield.svg",
    priorityClass: 5,
    targetingMethod: "self",

    async perform(battle: Battle, source: SideId): Promise<void> {
      const sourceMonster: Monster = battle.sides[source].monster;

      if (sourceMonster.defendActionCharges <= 0) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveId: getMoveId(this),
          reason: null,
        };
        battle.eventHistory.addEvent(failedEvent);
        return;
      }
      sourceMonster.defendActionCharges -= 1;

      const defenseComponent: DefendComponent = new DefendComponent(1, 2);
      sourceMonster.components.push(defenseComponent);
      const buffEvent: BuffEvent = {
        name: "buff",
        source: source,
        target: source,
        buffs: { armour: defenseComponent.bonusArmour },
      };
      battle.eventHistory.addEvent(buffEvent);
    },
    onFail: function (battle: Battle, source: SideId): Promise<void> {
      throw new Error("Function not implemented.");
    },
  }),

  defineMove("dodge", {
    type: "move",
    name: "Dodge",
    description: "Dodge an attack, avoid it completely.",
    priorityClass: 5,
    targetingMethod: "self",
    async perform(battle: Battle, source: SideId, targetingData: SelfTargeting): Promise<void> {
      const sourceMonster: Monster = battle.sides[source].monster;

      const dodgeChargeComponent: DodgeChargeComponent | null = sourceMonster.getComponent("dodgeCharges");
      if (!dodgeChargeComponent) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveId: getMoveId(this),
          reason: undefined,
        };
        battle.eventHistory.addEvent(failedEvent);
        return;
      }

      const dodgeComponent: DodgeStateComponent | null = sourceMonster.getComponent("dodging");
      if (!dodgeComponent) {
        sourceMonster.components.push(new DodgeStateComponent(1));
      } else {
        dodgeComponent.remainingDuration++;
      }
    },
    onFail: function (battle: Battle, source: SideId): Promise<void> {
      throw new Error("Function not implemented.");
    },
  }),

  defineMove("stun", {
    type: "move",
    name: "Stun",
    description: "Stun the monster, preventing it from taking actions for one turn.",
    priorityClass: 3,
    targetingMethod: "single-enemy",
    async perform(battle: Battle, source: SideId, targetingData: SingleEnemyTargeting): Promise<void> {
      const sourceMonster: Monster = battle.sides[source].monster;
      const target: SideId = targetingData.target;
      const targetMonster: Monster = battle.sides[target].monster;

      const abilityChargeStunComponent: AbilityChargeStunComponent | null = sourceMonster.getComponent("abilityChargeStun");
      if (!abilityChargeStunComponent) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveId: getMoveId(this),
          reason: undefined,
        };
        battle.eventHistory.addEvent(failedEvent);
        return;
      }

      const stunnedComponent: StunnedStateComponent | null = targetMonster.getComponent("stunned");
      if (!stunnedComponent) {
        sourceMonster.components.push(new StunnedStateComponent(1));
      } else {
        stunnedComponent.remainingDuration++;
      }
    },
    onFail: async function (battle: Battle, source: SideId): Promise<void> {
      throw new Error("Function not implemented.");
    },
  }),
]);
