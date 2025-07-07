import { MonsterPool } from "../data/monster_pool";
import { Battle, BattleOptions } from "../system/battle";
import { CliAdapter } from "../system/comms/cli_adapter";

const playerCount: number = 2;
console.log(`Players: ${playerCount}`);

const cli: CliAdapter = new CliAdapter(playerCount);
console.log(`CLI: Listen`);
cli.listen();

const battleOptions: BattleOptions = {
  seed: 0,
  playerOptionSet: [
    {
      name: "Grug",
      monsterTemplate: MonsterPool[0],
    },
    {
      name: "Greg",
      monsterTemplate: MonsterPool[0],
    },
  ],
  communicationAdapter: cli,
};
const battle: Battle = new Battle(battleOptions);
console.log(`Battle: Run`);
battle.run();
