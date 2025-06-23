import { Action, ActionCheck, ActionInterruptKind, ActionResult, ActionTag, Monster, MonsterTemplate, RerollCheck, RollCheck } from "../Combat";

export const MonsterPool: MonsterTemplate[] = [
  {
    name: "BlankMon",
    description: "Desc for Blank",
    imageUrl: "",
    baseStats: {
      health: 25,
      armorClass: 15,
      attack: 2,
    },
    attackActionId: 1,
    defendActionId: 2,
    baseDefendActionCharges: 3,
    abilityActionId: 0,
    baseAbilityActionCharges: 0,
  },
];

export const ActionPool: Action[] = [
  {
    name: "Nothing",
    description: "Do nothing...",
    priority: 0,
    tags: new Set(),
    *ActionGenerator(Caster: Monster, Target: Monster): Generator<ActionCheck, ActionResult> {
      throw new Error("Function not implemented.");
    },
  },
  {
    name: "Normal Attack",
    description: "Perform a regular attack.",
    priority: 0,
    tags: new Set([ActionTag.ATTACK]),

    *ActionGenerator(Caster: Monster, Target: Monster): Generator<ActionCheck, ActionResult> {
      let result: ActionResult;

      const attackRoll: RollCheck = {
        result: 0,
        kind: ActionInterruptKind.ROLL
      }
      yield attackRoll;

      if (false) {
        /// if caster has ability to reroll
        const reroll: RerollCheck = {
          kind: ActionInterruptKind.REROLL
        };
        yield reroll;
      }

      if (attackRoll.result + Caster.template.baseStats.attack + Caster.currentModifiers.attack < Target.template.baseStats.armorClass + Target.currentModifiers.armorClass) {
        //# Blocked
        result = {
          aniamtionId: -1,
          // TODO
        };
        return result;
      }

      //# Success
      result = {
        aniamtionId: -1,
        // TODO
      };
      return result;
    },
  },
  {
    name: "Defend",
    description: "Brace for an attack.",
    priority: 0,
    tags: new Set([ActionTag.DEFEND]),
    *ActionGenerator(Caster: Monster, Target: Monster): Generator<ActionCheck, ActionResult> {
      throw new Error("Function not implemented.");
    },
  },
];
