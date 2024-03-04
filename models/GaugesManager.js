"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugesManager = exports.DamageCauseBy = void 0;
const PacketType_1 = require("../enums/PacketType");
const bufferReader_1 = require("../utils/bufferReader");
const Action_1 = require("../enums/Action");
const itemsmanager_1 = require("../utils/itemsmanager");
var DamageCauseBy;
(function (DamageCauseBy) {
    DamageCauseBy[DamageCauseBy["HURT"] = 0] = "HURT";
    DamageCauseBy[DamageCauseBy["COLD"] = 1] = "COLD";
    DamageCauseBy[DamageCauseBy["FOOD"] = 2] = "FOOD";
    DamageCauseBy[DamageCauseBy["WATER"] = 3] = "WATER";
    DamageCauseBy[DamageCauseBy["OXYGEN"] = 4] = "OXYGEN";
    DamageCauseBy[DamageCauseBy["WARM"] = 5] = "WARM";
})(DamageCauseBy || (exports.DamageCauseBy = DamageCauseBy = {}));
class GaugesManager {
    sourcePlayer;
    food;
    cold;
    thirst;
    oxygen;
    warm;
    bandage;
    healTick;
    constructor(sourcePlayer) {
        this.sourcePlayer = sourcePlayer;
        this.food = 200;
        this.cold = 200;
        this.thirst = 200;
        this.oxygen = 200;
        this.warm = 0;
        this.bandage = 0;
        this.healTick = 0;
    }
    tick() {
        this.healTick++;
        //// const nearFire = !!this.sourcePlayer.gameServer.queryManager.queryCircle(this.sourcePlayer.x, this.sourcePlayer.y, 100)
        //    .find(x => x.type == EntityType.BIG_FIRE);
        let damageCount = 0;
        let damageCause = Action_1.Action.HURT;
        if (!this.sourcePlayer.stateManager.isInFire) {
            /**
            * Если есть жара снимаем жару если нет жары снимаем холод
            */
            // console.log(this.sourcePlayer.stateManager.isInFire);
            //let coldresist = this.sourceplayer.gameserver.worldcycle.isday() ? 2 : 18;
            //if(this.sourceplayer.statemanager.isinwater) coldresist += 7;
            //if(this.sourceplayer.hat != 0) {
            //    let ashat = itemutils.getitembyid(this.sourceplayer.hat);
            //    coldresist -= ashat.data.protectioncold;
            //}
            //coldresist = math.max(0, coldresist);
            //if(this.warm > 0) {
            //    this.warm -= coldresist
            //}else {
            //    this.cold -= coldresist;
            //}
            //aaa22
        }
        else {
            let coldIncrease = 0;
            if (this.sourcePlayer.hat != 0) {
                let hatEquiped = itemsmanager_1.ItemUtils.getItemById(this.sourcePlayer.hat);
                coldIncrease += hatEquiped.data.protectionCold;
            }
            if (this.cold >= 200) {
                this.warm += coldIncrease + 5;
            }
            else {
                this.cold += coldIncrease + 20;
            }
        }
        if (this.sourcePlayer.stateManager.isInWater) {
            this.thirst += 20;
        }
        if (this.thirst <= 0) {
            damageCount += 20;
            damageCause = Action_1.Action.COLD;
        }
        if (!this.sourcePlayer.stateManager.isInSea) {
            this.oxygen += 70;
            this.oxygen = Math.max(200, Math.min(0, this.oxygen));
            this.thirst -= 5;
        }
        if (this.oxygen <= 0) {
            damageCount += 30;
            damageCause = Action_1.Action.COLD;
        }
        if (this.sourcePlayer.stateManager.isInSea) {
            this.oxygen -= 40;
        }
        if (this.cold <= 0) {
            this.cold = 0;
            damageCount += 10;
            damageCause = Action_1.Action.COLD;
        }
        if (this.warm <= 0) {
            this.warm = 0;
            // умирать не придумали
        }
        // this.food -= 5;
        if (this.food <= 0) {
            this.food = 0;
            damageCount += 10;
            damageCause = Action_1.Action.HUNGER;
        }
        //    this.thirst -= 5;
        if (this.thirst <= 0) {
            this.thirst = 0;
            damageCount += 10;
            damageCause = Action_1.Action.COLD;
        }
        if (damageCount > 0) {
            this.sourcePlayer.health -= damageCount;
            this.sourcePlayer.action |= damageCause;
            this.healthUpdate();
            this.sourcePlayer.updateHealth(null);
            return;
        }
        if (this.healTick >= 2) {
            if (this.food >= 40 && this.cold >= 40 && this.thirst >= 40 && this.sourcePlayer.health < 200) {
                let healCount = 21;
                const asItem = itemsmanager_1.ItemUtils.getItemById(this.sourcePlayer.hat);
                if (asItem != null && asItem.data.healAdjust != null) {
                    healCount += asItem.data.healAdjust;
                }
                else if (this.bandage > 0) {
                    healCount = 40;
                    this.bandage--;
                }
                this.sourcePlayer.health += healCount;
                this.sourcePlayer.action |= Action_1.Action.HEAL;
            }
            this.healTick = 0;
        }
        this.sourcePlayer.health = Math.max(0, Math.min(200, this.sourcePlayer.health));
    }
    healthUpdate() {
        this.sourcePlayer.health = Math.max(0, Math.min(200, this.sourcePlayer.health));
        const writer = new bufferReader_1.BufferWriter(3);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.GaugeLife);
        writer.writeUInt8(Math.floor(this.sourcePlayer.health / 2));
        writer.writeUInt8(Math.floor(this.bandage));
        this.sourcePlayer.controller.sendBinary(writer.toBuffer());
    }
    update() {
        this.food = Math.min(200, Math.max(this.food, 0));
        this.cold = Math.min(200, Math.max(0, this.cold));
        this.warm = Math.min(200, Math.max(0, this.warm));
        this.oxygen = Math.min(200, Math.max(0, this.oxygen));
        this.thirst = Math.min(200, Math.max(0, this.thirst));
        this.sourcePlayer.health = Math.min(200, Math.max(0, this.sourcePlayer.health));
        const writer = new bufferReader_1.BufferWriter(8);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.Gauges);
        writer.writeUInt8(Math.floor(this.sourcePlayer.health / 2));
        writer.writeUInt8(Math.floor(this.food / 2));
        writer.writeUInt8(Math.floor(this.cold / 2));
        writer.writeUInt8(Math.floor(this.thirst / 2));
        writer.writeUInt8(Math.floor(this.oxygen / 2));
        writer.writeUInt8(Math.floor(this.warm / 2));
        writer.writeUInt8(Math.floor(this.bandage / 2));
        this.sourcePlayer.controller.sendBinary(writer.toBuffer());
        /* let itemsArray = this.sourcePlayer.inventory.toArray();
         if (itemsArray.includes(ItemIds.TURBAN1)) {
             this.sourcePlayer.inventory.addItem(ItemIds.DIAMOND_SPIKE, 1);
             console.log("GAVE")
         }*/
    }
}
exports.GaugesManager = GaugesManager;
