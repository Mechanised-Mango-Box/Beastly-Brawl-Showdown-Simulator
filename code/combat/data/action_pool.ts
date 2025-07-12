// TODO: make swappable instead of a global
import { Action, ActionId } from "../system/action";
import { Monster } from "../system/monster/monster";
import { Battle } from "../system/battle";
import { BlockedEvent, BuffEvent, DamageEvent, MoveEvadedEvent, MoveFailedEvent, MoveSuccessEvent, RerollEvent, RollEvent, StartMoveEvent } from "../system/history/events";
import { SideId } from "../system/side";
import { roll } from "../system/roll";
import { AbilityChargeStunComponent, DefendComponent, DodgeChargeComponent, DodgeStateComponent, RerollChargeComponent, StunnedStateComponent } from "../system/monster/component";

export function getAction(actionId: ActionId): Action | null {
  /// If action exists
  if (0 <= actionId && actionId < ActionPool.length) return ActionPool[actionId];
  return null;
}

const ActionPool: Action[] = [
  {
    name: "Nothing",
    description: "Do nothing...",
    perform: function (): Promise<void> {
      throw new Error("This action should not be used EVER.");
    },
    priortyClass: 0,
  },

  {
    name: "Normal Attack",
    description: "Perform a regular attack.",
    perform: async function (world: Battle, source: SideId, target: SideId): Promise<void> {
      const sourceMonster: Monster = world.sides[source].monster;
      const targetMonster: Monster = world.sides[target].monster;

      const startMoveEvent: StartMoveEvent = {
        name: "startMove",
        source: source,
        target: target,
        moveActionId: 1 as ActionId, // TODO this is a hack - find a better way of getting the id
      };
      world.eventHistory.events.push(startMoveEvent);

      //# Evade check
      const dodgeState: DodgeStateComponent | null = targetMonster.getComponent("dodging");
      if (dodgeState) {
        const moveEvadedEvent: MoveEvadedEvent = {
          name: "evaded",
          source: source,
          target: target,
          moveActionId: 1 as ActionId,
        };
        world.eventHistory.events.push(moveEvadedEvent);
        return;
      }

      //# Roll
      console.log(`${source} EMIT: Tell the player to roll a d20`); //TODO: placeholder
      await new Promise<void>((resolve) => {
        world.noticeBoard.postNotice(source, {
          kind: "roll",
          data: { diceFaces: 20 },
          callback: function (): void {
            world.noticeBoard.removeNotice(source, "roll");
            resolve();
          },
        });
      });
      let rollResult: number = roll(20);
      const rollEvent: RollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: rollResult,
      };
      world.eventHistory.events.push(rollEvent);

      // # Reroll
      const rerollComponent: RerollChargeComponent | null = sourceMonster.getComponent("reroll");
      if (rerollComponent && rerollComponent.charges > 0) {
        await new Promise<void>((resolve) => {
          world.noticeBoard.postNotice(source, {
            kind: "rerollOption",
            data: { diceFaces: 20 },
            callback: function (shouldReroll: boolean): void {
              if (shouldReroll) {
                rerollComponent.charges--;
                rollResult = roll(20);
                const rerollEvent: RerollEvent = {
                  name: "reroll",
                  source: source,
                  faces: 20,
                  result: rollResult,
                };
                world.eventHistory.events.push(rerollEvent);
              }
              world.noticeBoard.removeNotice(source, "rerollOption");
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
        world.eventHistory.events.push(blockedEvent);
        return;
      }

      const moveSuccessEvent: MoveSuccessEvent = {
        name: "moveSuccess",
        source: source,
        target: target,
        moveActionId: 1 as ActionId, // TODO this is a hack
      };
      world.eventHistory.events.push(moveSuccessEvent);

      //# Base damage roll
      const baseDamage: number = roll(4) + sourceMonster.template.baseStats.attack;

      //# Crit Check
      const critChanceBonus: number = sourceMonster.getCritChanceBonus();
      const critRollResult: number = roll(20);
      const critRollEvent: RollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: critRollResult,
      };
      world.eventHistory.events.push(critRollEvent);
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
      world.eventHistory.events.push(damageEvent);
    },
    priortyClass: 0,
  },

  {
    name: "Defend",
    description: "Increase your armor class temporarily.",
    async perform(battle: Battle, source: SideId): Promise<void> {
      const sourceMonster: Monster = battle.sides[source].monster;

      if (sourceMonster.defendActionCharges <= 0) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveActionId: 2 as ActionId,
          reason: undefined,
        };
        battle.eventHistory.events.push(failedEvent);
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
      battle.eventHistory.events.push(buffEvent);
    },
    priortyClass: 5,
  },

  {
    name: "Dodge",
    description: "Dodge an attack, avoid it completely.",
    priortyClass: 5,
    async perform(world: Battle, source: SideId, target: SideId): Promise<void> {
      const sourceMonster: Monster = world.sides[source].monster;

      const dodgeChargeComponent: DodgeChargeComponent | null = sourceMonster.getComponent("dodgeCharges");
      if (!dodgeChargeComponent) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveActionId: 3 as ActionId,
          reason: undefined,
        };
        world.eventHistory.events.push(failedEvent);
        return;
      }

      const dodgeComponent: DodgeStateComponent | null = sourceMonster.getComponent("dodging");
      if (!dodgeComponent) {
        sourceMonster.components.push(new DodgeStateComponent(1));
      } else {
        dodgeComponent.remainingDuration++;
      }
    },
  },

  {
    name: "Stun",
    description: "Stun the monster, preventing it from taking actions for one turn.",
    priortyClass: 3,
    async perform(world: Battle, source: SideId, target: SideId): Promise<void> {
      const sourceMonster: Monster = world.sides[source].monster;
      const targetMonster: Monster = world.sides[target].monster;

      const abilityChargeStunComponent: AbilityChargeStunComponent | null = sourceMonster.getComponent("abilityChargeStun");
      if (!abilityChargeStunComponent) {
        const failedEvent: MoveFailedEvent = {
          name: "moveFailed",
          source: source,
          target: source,
          moveActionId: 4 as ActionId,
          reason: undefined,
        };
        world.eventHistory.events.push(failedEvent);
        return;
      }

      const stunnedComponent: StunnedStateComponent | null = targetMonster.getComponent("stunned");
      if (!stunnedComponent) {
        sourceMonster.components.push(new StunnedStateComponent(1));
      } else {
        stunnedComponent.remainingDuration++;
      }
    },
  },
];
