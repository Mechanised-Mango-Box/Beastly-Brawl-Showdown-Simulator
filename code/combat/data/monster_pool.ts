import { asActionId } from "../system/action";
import { MonsterTemplate } from "../system/monster";

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
    attackActionId: asActionId(1),
    defendActionId: asActionId(2),
    baseDefendActionCharges: 3,
    abilityActionId: asActionId(0),
    baseAbilityActionCharges: 0,
  },
] as const;
