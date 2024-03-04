"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Action_1 = require("../enums/Action");
const EntityType_1 = require("../enums/EntityType");
const PacketType_1 = require("../enums/PacketType");
const GameProfile_1 = require("../models/GameProfile");
const bufferReader_1 = require("../utils/bufferReader");
const inventory_1 = require("../utils/inventory");
const Entity_1 = require("./Entity");
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const ItemIds_1 = require("../enums/ItemIds");
const StateManager_1 = require("../models/StateManager");
const ChatManager_1 = require("../models/ChatManager");
const Gauges_1 = require("../models/Gauges");
const itemsmanager_1 = require("../utils/itemsmanager");
const ItemAction_1 = require("../models/ItemAction");
const UpdateManager_1 = require("../models/UpdateManager");
const BuildingManager_1 = require("../models/BuildingManager");
const ECollisionManager_1 = require("../models/ECollisionManager");
const Utils_1 = require("../utils/Utils");
const Bullet_1 = require("./Bullet");
const VehiculeType_1 = require("../enums/VehiculeType");
const CraftManager_1 = require("../craft/CraftManager");
const MovementDirection_1 = require("../math/MovementDirection");
const PacketObscure_1 = require("../network/PacketObscure");
const QuestManager_1 = require("../models/QuestManager");
var startTime = new Date();
const num2d = function (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
class Player extends Entity_1.Entity {
    controller;
    gameProfile;
    inventory;
    stateManager;
    chatManager;
    gaugesManager;
    questManager;
    completeQuests = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    attack_pos;
    width = 3560;
    height = 2440;
    right = 0;
    vechile = 0;
    hat = 0;
    bag = false;
    itemActions;
    resdid;
    bandage = 0;
    isStunned = false;
    lastStun = 100;
    lastKick = 100;
    lastBuild = -1;
    lastHittenBuildDamager = -1;
    lastTotemCooldown = 300;
    lastHoodCooldown = 400;
    updateManager;
    buildingManager;
    collisionManager;
    totemFactory;
    isAdmin = false;
    ghost = false;
    ism = false;
    isFrozen = false;
    arrayList;
    ridingType = null;
    craftManager;
    tokenScore;
    keys;
    packets;
    boosterClaimed = false;
    packetObscure;
    prevDirection = 0;
    lastSurviveUpdate = performance.now();
    constructor(controller, id, gameServer, tokenScore, token, token_id) {
        super(id, id, gameServer);
        this.controller = controller;
        this.gameProfile = new GameProfile_1.GameProfile("namedYUSU", ~~(Math.random() * 155), ~~(Math.random() * 94), 0, 0, 0, 0, 0, 0, 0, 0, performance.now(), token, token_id); //new GameProfile("unnamed", ~~(Math.random() * 155), ~~(Math.random() * 94), 0, 0, 0, 0, 0, 0, 0, 0, performance.now(), token, token_id);
        // setInterval(() => {
        //     this.gameProfile.skin += 1;
        //     this.gameProfile.accessory += 1;
        //     this.gameProfile.book += 1;
        //     this.gameServer.broadcastBinary(Buffer.from([ ServerPacketTypeBinary.VerifiedAccount, this.id, this.gameProfile.skin, this.gameProfile.accessory, 0, this.gameProfile.book, 0, 0, this.gameProfile.skin ]));
        //     if(this.gameProfile.skin == 174) {
        //         this.gameProfile.skin = 0;
        //     }
        //     if(this.gameProfile.accessory == 88) {
        //         this.gameProfile.accessory = 0;
        //     }
        //     if(this.gameProfile.book > 40) {
        //         this.gameProfile.book = 0;
        //     }
        // }, 800  )
        if (serverconfig_json_1.default.inventory.withBag)
            this.bag = true;
        this.packetObscure = new PacketObscure_1.PacketObscure(this.controller);
        this.inventory = new inventory_1.Inventory(this, serverconfig_json_1.default.inventory.startSize);
        this.stateManager = new StateManager_1.StateManager(this);
        this.itemActions = new ItemAction_1.ItemAction(this);
        this.updateManager = new UpdateManager_1.UpdateManager(this);
        this.buildingManager = new BuildingManager_1.BuildingManager(this);
        this.craftManager = new CraftManager_1.CraftManager(this);
        this.questManager = new QuestManager_1.QuestManager(this);
        this.tokenScore = tokenScore;
        this.keys = {};
        this.packets = [];
        this.attack_pos = {};
        this.resdid = [];
        this.chatManager = new ChatManager_1.ChatManager(this);
        this.gaugesManager = new Gauges_1.GaugesManager(this);
        this.health = 200;
        this.gaugesManager.update();
        this.boosterClaimed = false;
        this.collisionManager = new ECollisionManager_1.ECollisionManager(this);
        this.right = ItemIds_1.ItemIds.HAND;
        this.updateInfo();
        if (this.gameServer.gameConfiguration.viplist.price1.includes(this.controller.userIp)) { //aaa22
            for (let i = 0; i < this.gameServer.gameConfiguration.kit2.length; i += 2) {
                const kitItem = this.gameServer.gameConfiguration.kit2[i];
                const kitItemCount = this.gameServer.gameConfiguration.kit2[i + 1];
                //@ts-ignore
                this.inventory.addItem(ItemIds_1.ItemIds[kitItem], kitItemCount);
            }
        }
        else {
            for (let i = 0; i < this.gameServer.gameConfiguration.kit.length; i += 2) {
                const kitItem = this.gameServer.gameConfiguration.kit[i];
                const kitItemCount = this.gameServer.gameConfiguration.kit[i + 1];
                //@ts-ignore
                this.inventory.addItem(ItemIds_1.ItemIds[kitItem], kitItemCount);
            }
        }
        if (serverconfig_json_1.default.inventory.withBag) {
            this.bag = true;
            this.updateInfo();
        }
    }
    updateInfo() {
        this.info = this.right + (this.hat * 128);
        if (this.bag && !this.ghost)
            this.info += 16384;
    }
    giveBoosterkit(id, player) {
        if (player.ownerClass.id == id) {
            //we give kit here
            // player.ownerClass.inventory.addItem(ItemIds.PIRATE_HAT, 1);
            //player.ownerClass.inventory.addItem(ItemIds.PIRATE_HAT, 1)
            console.log("AIWNGUIWGNGI");
        }
    }
    updateStun() {
        if (!this.isStunned)
            return;
        if (performance.now() - this.lastStun > 2000)
            this.isStunned = false;
    }
    survivalUpdate() {
        this.gaugesManager.tick();
        this.gaugesManager.update();
        const now = performance.now();
        if (now - this.lastSurviveUpdate > serverconfig_json_1.default.other.dayInMilliseconds) {
            this.lastSurviveUpdate = now;
            const writer = new bufferReader_1.BufferWriter(1);
            writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.Survive);
            this.controller.sendBinary(writer.toBuffer());
            this.gameProfile.days++;
            if (this.gameProfile.days == 100)
                this.inventory.addItem(ItemIds_1.ItemIds.FLOWER_HAT, 1);
            this.gameProfile.score += 5000;
        }
        let itemsArray2 = this.inventory.toArray();
        for (let i = 0; i < itemsArray2.length; i++) {
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.TURBAN2 && this.inventory.countItem(ItemIds_1.ItemIds.AMETHYST_SPIKE) < 40) {
                this.inventory.addItem(ItemIds_1.ItemIds.AMETHYST_SPIKE, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.PIRATE_HAT) {
                this.inventory.addItem(ItemIds_1.ItemIds.WOOD, 10);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.CHRISTMAS_HAT && this.inventory.countItem(ItemIds_1.ItemIds.REIDITE_SPIKE) < 10) {
                this.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPIKE, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.ALOE_VERA_SEED && itemsArray2[i][1] >= 1) {
                this.inventory.addItem(ItemIds_1.ItemIds.HAWK, 1);
                this.inventory.removeItem(ItemIds_1.ItemIds.ALOE_VERA_SEED, itemsArray2[i][1], true);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.THORNBUSH_SEED && itemsArray2[i][1] >= 1) {
                this.inventory.addItem(ItemIds_1.ItemIds.HAWK, 1);
                this.inventory.removeItem(ItemIds_1.ItemIds.THORNBUSH_SEED, itemsArray2[i][1], true);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.TURBAN1 && this.inventory.countItem(ItemIds_1.ItemIds.DIAMOND_SPIKE) < 40) {
                this.inventory.addItem(ItemIds_1.ItemIds.DIAMOND_SPIKE, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.SADDLE && itemsArray2[i][1] >= 1) {
                this.inventory.addItem(ItemIds_1.ItemIds.BABY_DRAGON, 1);
                this.inventory.removeItem(ItemIds_1.ItemIds.SADDLE, itemsArray2[i][1], true);
            }

        }
    }
    survivalUpdate2() {
        let itemsArray2 = this.inventory.toArray();
        for (let i = 0; i < itemsArray2.length; i++) {
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.WAND1) {
                this.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 1);
            }
            if (itemsArray2[i][0] == ItemIds_1.ItemIds.WAND2) {
                this.inventory.addItem(ItemIds_1.ItemIds.FIREFLY, 2);
            }
        }
    }
    updateEquipment(id) {
        if (!this.inventory.containsItem(id)) {
            if (this.hat == id) {
                this.hat = 0;
                this.updateInfo();
            }
            if (this.extra == id) {
                this.extra = 0;
                this.max_speed = 24;
                //this.ridingType = null;
                this.isFly = false;
            }
            if (this.right == id) {
                this.right = ItemIds_1.ItemIds.HAND;
                this.updateInfo();
            }
        }
    }
    syncUpdate() {
        this.craftManager.update();
        this.questManager.tickUpdate();
        this.collisionManager.updateCollides();
        // this.inventory.addItem(ItemIds.PICK_WOOD, 1)
        //  this.callAttackTick();
        /*let arr: any[] = [];

        if(this.arrayList) arr.push({x: this.arrayList.x , y: this.arrayList.y, r: 30})
       //  arr.push({ x: this.attack_pos.x , y: this.attack_pos.y , r: this.attack_pos.radius})
         for(let i = 0; i < this.gameServer.entities.length; i++) {
             let o = this.gameServer.entities[i] as any;

             if(Utils.distanceSqrt(o.x , o.y, this.x, this.y) > 500) continue;

             arr.push({x: o.x, y: o.y,r: o.radius, data: {type: o.type}});

             if(Utils.isBuilding(o)) {
               
                arr.push({x: o.x, y: o.y, r: o.ownerClass.metaData.collideResolveRadius})
             }
         }
         arr.push({x: this.x, y: this.y , r: this.radius, data: {type: this.type}});
         this.controller.sendJSON([ServerPacketTypeJson.XzKarmani, arr])*/
        //  this.callEntityUpdate(false);
        this.callEntityUpdate(false);
    }
    callEntityUpdate(isHard) {
        const entities = this.updateManager.getEntities(isHard);
        const writer = new bufferReader_1.BufferWriter(2 + entities.length * 18);
        writer.writeUInt16(PacketType_1.ServerPacketTypeBinary.EntityUpdate);
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            //   if(entity.id == this.ownerClass.id &&this.ghost){
            //     writer.writeUInt8(entity.playerId);
            //     writer.writeUInt8(entity.angle);
            //     writer.writeUInt16(entity.action);
            //     writer.writeUInt16(entity.type);
            //     writer.writeUInt16(entity.x);
            //     writer.writeUInt16(entity.y);
            //     writer.writeUInt16(entity.id);
            //     writer.writeUInt16(2);//entity.info);
            //     writer.writeUInt16(entity.speed * 10);
            //     writer.writeUInt16(entity.extra);
            //   }else{
            //     writer.writeUInt8(entity.playerId);
            //     writer.writeUInt8(entity.angle);
            //     writer.writeUInt16(entity.action);
            //     writer.writeUInt16(entity.type);
            //     writer.writeUInt16(entity.x);
            //     writer.writeUInt16(entity.y);
            //     writer.writeUInt16(entity.id);
            //     writer.writeUInt16(entity.info);//entity.info);
            //     writer.writeUInt16(entity.speed * 10);
            //     writer.writeUInt16(entity.extra);
            //   }
            writer.writeUInt8(entity.playerId);
            writer.writeUInt8(entity.angle);
            writer.writeUInt16(entity.action);
            writer.writeUInt16(entity.type);
            writer.writeUInt16(entity.x);
            writer.writeUInt16(entity.y);
            writer.writeUInt16(entity.id);
            writer.writeUInt16(entity.info); //entity.info);
            writer.writeUInt16(entity.speed * 10);
            writer.writeUInt16(entity.extra);
        }
        if (entities.length > 0)
            this.controller.sendBinary(writer.toBuffer());
        // this.gameServer.broadcastBinary(writer.toBuffer());
    }
    updateMovement(direction) {
        //     console.log(Utils.distanceSqrt(this.x, this.y, this.predirection_x, this.predirection_y))
        var pos1 = { x: 0, y: 0 };
        this.vector.x = 0;
        this.vector.y = 0;
        let speed = this.speed;
        let deplifier = .71;
        switch (direction) {
            case MovementDirection_1.MovementDirection.LEFT:
                this.vector.x -= speed;
                break;
            case MovementDirection_1.MovementDirection.RIGHT:
                this.vector.x += speed;
                break;
            case MovementDirection_1.MovementDirection.TOP:
                this.vector.y += speed;
                break;
            case MovementDirection_1.MovementDirection.BOTTOM:
                this.vector.y -= speed;
                break;
            case MovementDirection_1.MovementDirection.LEFT_BOTTOM:
                this.vector.x -= speed * deplifier;
                this.vector.y += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.RIGHT_BOTTOM:
                this.vector.x += speed * deplifier;
                this.vector.y += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.RIGHT_TOP:
                this.vector.y -= speed * deplifier;
                this.vector.x += speed * deplifier;
                break;
            case MovementDirection_1.MovementDirection.LEFT_TOP:
                this.vector.x -= speed * deplifier;
                this.vector.y -= speed * deplifier;
                break;
        }
        this.stateManager.isFrictionEnabled = this.vector.y > 0;
        var pos2 = { x: this.vector.x, y: this.vector.y };
        var distance = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
        if (itemsmanager_1.ItemUtils.getItemById(this.extra).data.vehicule_type == VehiculeType_1.VehiculeType.GROUND) {
        }
        else if (distance > 15) {
            if (this.ownerClass.ISF) {
            }
            else {
                this.extra ? this.isFly = true : this.isFly = false;
            }
        }
        else {
            if (!this.ownerClass.ISF && this.stateManager.isInRoof == false)
                this.isFly = false;
        }
    }
    onEntityUpdate() {
    }
    updateDirection(direction) {
        this.oldDirection = this.direction;
        /**
         * Setting new direction for vec2d
         */
        this.direction = direction;
        /**
         * State update
         */
        if (direction == 0) {
            this.action |= Action_1.Action.IDLE;
            this.action &= ~Action_1.Action.WALK;
            //this.updateMovement(true);
        }
        else {
            this.action &= ~Action_1.Action.IDLE;
            this.action |= Action_1.Action.WALK;
        }
        /**
         * Update vector2d
         */
        //this.updateMovement();
        this.syncUpdate();
    }
    tickUpdate() {
        let baseSpeed = this.old_speed;
        this.old_speed = this.max_speed;
        const weaponFactor = itemsmanager_1.ItemUtils.getItemById(this.right);
        let decreaseWeapon = 0;
        if (weaponFactor != null && weaponFactor.type == itemsmanager_1.ItemType.EQUIPPABLE && weaponFactor.meta_type == itemsmanager_1.ItemMetaType.SWORD && !this.ownerClass.ISF) {
            if (this.ownerClass.ISF) {
                if (baseSpeed > 16)
                    decreaseWeapon = serverconfig_json_1.default.entities.player.speed_weapon;
            }
            else {
                decreaseWeapon = serverconfig_json_1.default.entities.player.speed_weapon;
            }
        }
        if (decreaseWeapon > 0 && !this.ownerClass.ISF) {
            if (this.ownerClass.ISF) {
                if (baseSpeed > 16)
                    baseSpeed -= (this.collideCounter > 0 ? 0 : (this.extra > 0 ? decreaseWeapon / 4.5 : decreaseWeapon / 3));
            }
            else {
                baseSpeed -= (this.collideCounter > 0 ? 0 : (this.extra > 0 ? decreaseWeapon / 4.5 : decreaseWeapon / 3));
            }
        }
        if (this.stateManager.holdingAttack) {
            if (this.ownerClass.ISF) {
                if (baseSpeed > 16)
                    baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease / ((this.collideCounter > 0 || this.extra > 0) ? 1.5 : 1);
            }
            else {
                baseSpeed -= serverconfig_json_1.default.entities.player.speed_attack_decrease / ((this.collideCounter > 0 || this.extra > 0) ? 1.5 : 1);
            }
        }
        if (this.stateManager.isInWater)
            baseSpeed -= (this.hat == ItemIds_1.ItemIds.DIVING_MASK || this.hat == ItemIds_1.ItemIds.SUPER_DIVING_SUIT) ? 4 : 8;
        if (this.direction == 12)
            this.direction = 4;
        if (this.direction == 13)
            this.direction = 5;
        if (this.direction == 14)
            this.direction = 6;
        let direction = this.direction;
        if (this.extra != 0) {
            let asItem = itemsmanager_1.ItemUtils.getItemById(this.extra);
            let ras = asItem.data.raiseSpeed;
            if (this.direction != 0 && Utils_1.Utils.checkVehiculeCondition(this, asItem.data.vehicule_type)) {
                // if (asItem.data.vehicule_type == VehiculeType.FLOAT) {
                //     if (this.hat == ItemIds.PIRATE_HAT) {
                //         baseSpeed *= 1.125;
                //     }
                // }
                // if (asItem.data.vehicule_type == VehiculeType.FLY) {
                //     if (this.hat == ItemIds.PILOT_HELMET) {
                //         ras *= 1.45;
                //     }
                // }
                baseSpeed = Math.min(baseSpeed, (this.speed + ras));
            }
            else {
                if (this.speed > 1) {
                    if (this.ownerClass.ISF || this.stateManager.isInRoof == true) {
                        if (baseSpeed < 16) {
                            baseSpeed = 16.5;
                        }
                        else {
                            if (baseSpeed < 16)
                                baseSpeed = Math.max(1, (this.speed - asItem.data.slowSpeed));
                        }
                    }
                    else {
                        baseSpeed = Math.max(1, (this.speed - asItem.data.slowSpeed));
                    }
                    if (this.direction < 1)
                        direction = this.oldDirection;
                }
                this.old_speed = Math.max(0, baseSpeed);
            }
            if (this.prevDirection != this.direction) {
                let isDiagonal = (this.direction == MovementDirection_1.MovementDirection.LEFT_BOTTOM ||
                    this.direction == MovementDirection_1.MovementDirection.RIGHT_BOTTOM ||
                    this.direction == MovementDirection_1.MovementDirection.LEFT_TOP ||
                    this.direction == MovementDirection_1.MovementDirection.LEFT_BOTTOM);
                if (!isDiagonal && !this.isFly)
                    baseSpeed /= 1.65;
            }
        }
        // console.log(this.stateManager.isInRoof);  //aaa22
        this.speed = baseSpeed;
        this.updateMovement(direction);
        this.prevDirection = this.direction;
        const now = performance.now(), attack_diff = now - this.stateManager.lastAttack;
        if (this.stateManager.holdingAttack && attack_diff > 450) {
            this.stateManager.lastAttack = now;
            this.action |= Action_1.Action.ATTACK;
            this.updateAttackDot();
            this.hitHappened();
        }
        else if (this.stateManager.holdingAttack && attack_diff < 458)
            this.action &= ~Action_1.Action.ATTACK;
    }
    updateAttackDot() {
        // let offset = 17;
        let expandOffset = 0, expandRadius = 0;
        let brofly = this.isFly ? 1.35 : 1;
        if (this.right != ItemIds_1.ItemIds.HAND) {
            const rightItem = itemsmanager_1.ItemUtils.getItemById(this.right).data;
            expandOffset = rightItem.expandOffset * brofly;
            expandRadius = rightItem.expandRadius * brofly;
        }
        if (this.right == ItemIds_1.ItemIds.HAND) {
            expandRadius = 25 * brofly;
            expandOffset = 15 * brofly;
        }
        let angle_x = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + Math.cos((this.angle + 31.875) / 127 * Math.PI));
        let angle_y = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + -Math.cos((this.angle + 31.875) / 127 * Math.PI));
        this.attack_pos = {
            x: this.x + angle_x * (expandOffset),
            y: this.y + angle_y * (expandOffset),
            radius: expandRadius
        };
    }
    hitHappened() {
        let handItemEquiped = itemsmanager_1.ItemUtils.getItemById(this.right);
        if (handItemEquiped != null) {
            switch (handItemEquiped.meta_type) {
                case itemsmanager_1.ItemMetaType.SHOVEL: {
                    if (this.stateManager.isInSea)
                        return;
                    let itemToGive = this.stateManager.isInSand ? ItemIds_1.ItemIds.SAND : ItemIds_1.ItemIds.GROUND;
                    let countIncrease = handItemEquiped.data.mine_increase;
                    this.inventory.addItem(itemToGive, countIncrease);
                    break;
                }
                case itemsmanager_1.ItemMetaType.BOW: {
                    const arrow = new Bullet_1.Bullet(this.gameServer.entityPool.nextId(), this.id, this.gameServer, handItemEquiped);
                    //this.spell = this.info & 15; //<- тип стрелы в говна
                    //this.fly = this.extra & 1;
                    //[2 3 4 5 6 7 8] <- типы стрел от дерев до драг
                    //???
                    let angle_x = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + Math.cos((this.angle + 31.875) / 127 * Math.PI));
                    let angle_y = (Math.sin((this.angle + 31.875) / 127 * Math.PI) + -Math.cos((this.angle + 31.875) / 127 * Math.PI));
                    let travelDist = 360;
                    const p2s = {
                        x: this.x + angle_x * (travelDist),
                        y: this.y + angle_y * (travelDist),
                    };
                    // arrow.shouldTravel = travelDist;
                    arrow.initEntityData(this.x, this.y, ~~(this.angle - 90 / 360 * 255), EntityType_1.EntityType.SPELL, false);
                    arrow.initOwner(arrow);
                    //  arrow.angle = 0;
                    arrow.angle = this.angle;
                    arrow.max_speed = 24;
                    arrow.speed = 24;
                    arrow.info = ((this.x - (this.x % 10)) >> 4 << 4) | 1 + ~~(Math.random() * 8); // должна быть деревянная шмара
                    const fly = true;
                    arrow.extra = this.y | (fly ? 1 : 0);
                    this.arrayList = {
                        x: p2s.x,
                        y: p2s.y
                    };
                    this.gameServer.initLivingEntity(arrow);
                    break;
                }
            }
        }
        const entities = this.gameServer.queryManager.queryCircle(this.attack_pos.x, this.attack_pos.y, this.attack_pos.radius);
        for (let i = 0; i < entities.length; i++) {
            const ent = entities[i];
            if (ent.id == this.id) {
                continue;
            }
            //@ts-ignore
            if (ent.isFly != this.isFly)
                continue;
            if (ent.type == EntityType_1.EntityType.PLAYERS && ent.ownerClass.ghost != this.ownerClass.ghost) {
                continue;
            }
            ent.receiveHit(this);
        }
    }
}
exports.Player = Player;
