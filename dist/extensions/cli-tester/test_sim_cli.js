"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const battle_1 = require("@sim/core/battle");
const cli_adapter_1 = require("./cli_adapter");
const common_monster_pool_1 = require("@sim/data/common/common_monster_pool");
const common_move_pool_1 = require("@sim/data/common/common_move_pool");
const battleOptions = {
    seed: 0,
    playerOptionSet: [{ monsterId: "mystic_wryven" }, { monsterId: "shadow_fang" }],
    monsterPool: common_monster_pool_1.COMMON_MONSTER_POOL,
    movePool: common_move_pool_1.COMMON_MOVE_POOL,
};
const battle = new battle_1.Battle(battleOptions);
console.log(`Battle: Run`);
battle.run();
console.log(`CLI: Listen`);
const cli = new cli_adapter_1.CliAdapter(battle.noticeBoard, battle.eventHistory);
cli.listen();
