import { COMMON_MONSTER_POOL } from "../../data/common_monster_pool";
import { Battle, BattleOptions } from "../../core/battle";
import { CliAdapter } from "./cli_adapter";

const battleOptions: BattleOptions = {
  seed: 0,
  playerOptionSet: [{ monsterId: "mystic_wryven" }, { monsterId: "shadow_fang" }],
  monsterPool: COMMON_MONSTER_POOL,
};
const battle: Battle = new Battle(battleOptions);
console.log(`Battle: Run`);
battle.run();

console.log(`CLI: Listen`);
const cli: CliAdapter = new CliAdapter(battle.noticeBoard, battle.eventHistory);
cli.listen();
