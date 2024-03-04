"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardPlayer = exports.resolveKill = void 0;
const ItemIds_1 = require("../enums/ItemIds");
const rewardList = [
    {
        value: 10,
        rewardItems: [[ItemIds_1.ItemIds.WAND1, 1]],
        rewardScore: 1000,
        alertMessage: "WAND1 10kills"
    }, {
        value: 19,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 5]],
        rewardScore: 1000,
        alertMessage: "PIRATESWORD WILL IN YOUR INVENTORY NEXT KILL"
    }, {
        value: 20,
        rewardItems: [[ItemIds_1.ItemIds.PIRATE_SWORD, 1]],
        rewardScore: 1000,
        alertMessage: "PIRATESWORD 20kills"
    }, {
        value: 25,
        rewardItems: [[ItemIds_1.ItemIds.WAND2, 1]],
        rewardScore: 1000,
        alertMessage: "WAND2 25kills"
    }, {
        value: 30,
        rewardItems: [[ItemIds_1.ItemIds.TURBAN1, 1]],
        rewardScore: 1000,
        alertMessage: "TURBAN 30kills"
    }, {
        value: 49,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 20]],
        rewardScore: 1000,
        alertMessage: "NEXT KILL YOU CAN GET ORANGE GEM 49kills"
    }, {
        value: 50,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.TURBAN2, 1]],
        rewardScore: 1000,
        alertMessage: "ORANGE GEM & NINJA HAT 50kills"
    }, {
        value: 99,
        rewardItems: [[ItemIds_1.ItemIds.FIREFLY, 20]],
        rewardScore: 1000,
        alertMessage: "NEXT KILL YOU CAN GET BLUE GEM 99kills"
    }, {
        value: 100,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.PLANE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got GEM 100kills gg"
    }, {
        value: 150,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "YOU GET ORANGE GEM 150kills gg"
    }, {
        value: 200,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 200kills gg"
    },
    {
        value: 250,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 250kills gg"
    }, {
        value: 300,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You gotGEM 300kills gg"
    },
    {
        value: 350,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 350kills gg"
    }, {
        value: 400,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 400kills gg"
    },
    {
        value: 450,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 450kills gg"
    }, {
        value: 500,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 500kills gg"
    },
    {
        value: 550,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 50kills gg"
    }, {
        value: 600,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 600kills gg"
    },
    {
        value: 650,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 650kills gg"
    }, {
        value: 700,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 700kills gg"
    },
    {
        value: 750,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50], [ItemIds_1.ItemIds.CHRISTMAS_HAT, 1]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 750kills gg AND CHRISTMAS HAT"
    }, {
        value: 800,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 800kills gg"
    },
    {
        value: 850,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 850kills gg"
    }, {
        value: 900,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_BLUE, 1], [ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got BLUE GEM 900kills gg"
    },
    {
        value: 950,
        rewardItems: [[ItemIds_1.ItemIds.GEMME_ORANGE, 1], [ItemIds_1.ItemIds.FIREFLY, 50]],
        rewardScore: 1000,
        alertMessage: "You got orange GEM 950kills gg"
    }, {
        value: 1000,
        rewardItems: [[ItemIds_1.ItemIds.DIAMOND_HELMET, 1], [ItemIds_1.ItemIds.SWORD_DIAMOND, 1], [ItemIds_1.ItemIds.HAWK, 1]],
        rewardScore: 1000,
        alertMessage: "BRO 1000KILLS"
    }
];
function resolveKill(killer, entity) {
    killer.gameProfile.kills++;
    rewardPlayer(killer);
    killer.health = 200;
    killer.gaugesManager.healthUpdate();
}
exports.resolveKill = resolveKill;
function rewardPlayer(pl) {
    for (const rewardData of rewardList) {
        const rwData = rewardData;
        if (rwData.value == pl.gameProfile.kills) {
            for (let i = 0; i < rwData.rewardItems.length; i++) {
                pl.inventory.addItem(rwData.rewardItems[i][0], rwData.rewardItems[i][1]);
            }
            if (rwData.alertMessage.length > 0)
                pl.controller.sendJSON([4, rwData.alertMessage]);
            if (rwData.rewardScore > 0)
                pl.gameProfile.score += rwData.rewardScore;
            return;
        }
    }
    pl.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 3);
    pl.gameProfile.score += 1000;
    pl.controller.sendJSON([4, `Now you have ${pl.gameProfile.kills}kills`]);
    if (pl.gameProfile.kills < 10) {
        pl.inventory.addItem(ItemIds_1.ItemIds.GOLD_SPIKE, 4);
    }
    else if (pl.gameProfile.kills < 15) {
        pl.inventory.addItem(ItemIds_1.ItemIds.DIAMOND_SPIKE, 3);
    }
    else if (pl.gameProfile.kills < 20) {
        pl.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 2);
    }
    else if (pl.gameProfile.kills > 20 && pl.gameProfile.kills < 40) {
        pl.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPIKE, 2);
        pl.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 3);
    }
    // pl.gameProfile.level = pl.gameProfile.kills;
}
exports.rewardPlayer = rewardPlayer;
