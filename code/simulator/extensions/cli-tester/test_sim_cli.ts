import { MonsterPool } from "../../data/monster_pool";
import { Battle, BattleOptions } from "../../core/battle";
import { CliAdapter } from "./cli_adapter";

const battleOptions: BattleOptions = {
  seed: 0,
  playerOptionSet: [
    {
      name: "Grug",
      monsterTemplate: MonsterPool[0],
    },
    {
      name: "Greg",
      monsterTemplate: MonsterPool[1],
    },
  ],
  player_option_timeout: 1000,
};
const battle: Battle = new Battle(battleOptions);
console.log(`Battle: Run`);
battle.run();

console.log(`CLI: Listen`);
const cli: CliAdapter = new CliAdapter(battle.noticeBoard, battle.eventHistory);
cli.listen();
