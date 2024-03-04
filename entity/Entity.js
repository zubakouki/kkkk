"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Action_1 = require("../enums/Action");
const EntityType_1 = require("../enums/EntityType");
const ItemIds_1 = require("../enums/ItemIds");
const PacketType_1 = require("../enums/PacketType");
const CollisionUtils_1 = require("../math/CollisionUtils");
const Vector2D_1 = __importDefault(require("../math/Vector2D"));
const serverconfig_json_1 = __importDefault(require("../settings/serverconfig.json"));
const bufferReader_1 = require("../utils/bufferReader");
const EntityUtils_1 = require("../utils/EntityUtils");
const itemsmanager_1 = require("../utils/itemsmanager");
const Utils_1 = require("../utils/Utils");
const WorldEvents_1 = require("../world/WorldEvents");
const Player_1 = require("./Player");
const PvPTime_1 = require("../exec/PvPTime");
const WorldCycle_1 = require("../world/WorldCycle");
const BuildingManager_1 = require("../models/BuildingManager");
const WorldBiomeResolver_1 = require("../world/WorldBiomeResolver");
const Biomes_1 = require("../enums/Biomes");
const ItemByChance_1 = require("../exec/ItemByChance");
const QuestType_1 = require("../enums/QuestType");
class Entity {
    spawnTime = performance.now();
    id;
    playerId = 0;
    BuilderKitClaimed = 0;
    ChanceKitClaimed = 0;
    x = 2500;
    y = 2500;
    radius = 30;
    angle = 0;
    extra = 0;
    speed = 24;
    max_speed = 24;
    action = 0;
    info = 0;
    type = 0;
    gameServer;
    direction = 0;
    oldX = 0;
    oldY = 0;
    health = 200;
    max_health = 200;
    old_health = 200;
    old_speed = 24;
    date = performance.now();
    isSolid = true;
    ghost = true;
    collideSpeed = 1;
    collidesRiver = false;
    ownerClass;
    abstractType = EntityUtils_1.EntityAbstractType.DEFAULT;
    isDestroyed = false;
    god = false;
    oldDirection = -1;
    olderDirection = -1;
    isFly = false;
    ISF = false;
    ISF2 = false;
    vector = new Vector2D_1.default(0, 0);
    collideCounter = 0;
    dist_winter = -1000000;
    dist_dragon = -1000000;
    dist_forest = -1000000;
    dist_sand = -1000000;
    dist_desert = -1000000;
    dist_lava = -1000000;
    dist_water = -1000000;
    biomeIn = Biomes_1.Biomes.SEA;
    constructor(id, playerId, gameServer) {
        this.id = id;
        this.playerId = playerId;
        this.gameServer = gameServer;
    }
    initEntityData(x, y, angle, type, isSolid = true) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type;
        this.isSolid = isSolid;
    }
    initOwner(owner) {
        this.ownerClass = owner;
    }
    isCollides(x = this.x, y = this.y, radius = this.radius) {
        const entities = this.gameServer.queryManager.queryCircle(x, y, radius);
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.id != this.id && entity.isSolid)
                return true;
        }
        return false;
    }
    receiveHit(damager, damage = -1) {
        if (this.isDestroyed || this.god)
            return;
        let finalDamage = damage;
        let imt = null;
        if (damager instanceof Player_1.Player) {
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (damager.right == ItemIds_1.ItemIds.HAND && damager.hat == ItemIds_1.ItemIds.HOOD &&
                    !this.ownerClass.isInFire && (this.ownerClass.hat != ItemIds_1.ItemIds.PEASANT && this.ownerClass.hat != ItemIds_1.ItemIds.WINTER_PEASANT) &&
                    this.gameServer.worldCycle.cycle == WorldCycle_1.CYCLE.DAY &&
                    performance.now() - damager.lastHoodCooldown > 8000) {
                    let itemsArray = this.ownerClass.inventory.toArray();
                    let randomItem = itemsArray[~~(Math.random() * itemsArray.length)];
                    let item = randomItem[0];
                    let count = Math.min(255, randomItem[1]);
                    this.ownerClass.inventory.removeItem(item, count);
                    damager.inventory.addItem(item, count);
                    damager.lastHoodCooldown = performance.now();
                }
            }
            const itemInHand = itemsmanager_1.ItemUtils.getItemById(damager.right);
            imt = itemInHand;
            if (itemInHand != null && itemInHand.meta_type != itemsmanager_1.ItemMetaType.WRENCHABLE) {
                if (itemInHand.type == itemsmanager_1.ItemType.EQUIPPABLE) {
                    if (Utils_1.Utils.isBuilding(this)) {
                        finalDamage = Math.max(0, itemInHand.data.building_damage - this.ownerClass.damageProtection);
                        this.ownerClass.onHitReceive(damager);
                    }
                    else
                        finalDamage = itemInHand.data.damage;
                }
                else {
                    if (Utils_1.Utils.isBuilding(this)) {
                        finalDamage = Math.max(0, 2 - this.ownerClass.damageProtection);
                        this.ownerClass.onHitReceive(damager);
                    }
                    else
                        finalDamage = 5;
                }
            }
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (this.ownerClass.hat != 0) {
                    const hatItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.hat);
                    const protectionSuffler = hatItem.data.protection;
                    finalDamage -= protectionSuffler;
                }
                if (this.ownerClass.right != 0) {
                    const rightItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.right);
                    if (rightItem != null && rightItem.meta_type == itemsmanager_1.ItemMetaType.SHIELD) {
                        const protectionSuffler = rightItem.data.protection ?? 0;
                        finalDamage -= protectionSuffler;
                    }
                }
            }
        }
        if (Utils_1.Utils.isMob(damager)) {
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (this.ownerClass.hat != 0) {
                    const hatItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.hat);
                    const protectionSuffler = hatItem.data.animal_protection ?? 9;
                    finalDamage -= protectionSuffler;
                }
                if (this.ownerClass.right != 0) {
                    const rightItem = itemsmanager_1.ItemUtils.getItemById(this.ownerClass.right);
                    if (rightItem != null && rightItem.meta_type == itemsmanager_1.ItemMetaType.SHIELD) {
                        const protectionSuffler = rightItem.data.protection;
                        finalDamage -= protectionSuffler;
                    }
                }
            }
        }
        if (this.type == EntityType_1.EntityType.PLAYERS && damager instanceof Player_1.Player &&
            damager.totemFactory && Utils_1.Utils.isContains(this.id, damager.totemFactory.data)) {
            finalDamage = ~~(finalDamage / 6);
        }
        ;
        if (imt != null && imt.meta_type == itemsmanager_1.ItemMetaType.WRENCHABLE && Utils_1.Utils.isBuilding(this) && this.ownerClass.metaData.healthSendable) {
            finalDamage = -imt.data.building_damage;
        }
        else
            finalDamage = Math.max(0, finalDamage);
        this.action |= Action_1.Action.HURT;
        this.health = Math.max(0, Math.min(this.max_health, this.health - finalDamage));
        switch (this.type) {
            case EntityType_1.EntityType.PLAYERS: {
                this.ownerClass.gaugesManager.healthUpdate();
                this.ownerClass.lastHoodCooldown = performance.now();
                break;
            }
        }
        if (this.ownerClass != null && this.ownerClass.factoryOf && this.ownerClass.factoryOf == "building") {
            if (this.ownerClass.metaData.healthSendable) {
                this.info = Utils_1.Utils.InMap(this.health, 0, this.max_health, 0, 100);
            }
            const data = new bufferReader_1.BufferWriter(8);
            data.writeUInt16(PacketType_1.ServerPacketTypeBinary.HittenOther);
            data.writeUInt16(this.id);
            data.writeUInt16(this.playerId);
            data.writeUInt16(damager.angle);
            const playersArr = this.gameServer.queryManager.queryRectPlayers(this.x, this.y, 2560, 1440);
            for (let i = 0; i < playersArr.length; i++) {
                const player_ = playersArr[i];
                player_.controller.sendBinary(data.toBuffer());
            }
        }
        if (this.type == EntityType_1.EntityType.BOAR ||
            this.type == EntityType_1.EntityType.BABY_DRAGON ||
            this.type == EntityType_1.EntityType.LAVA_DRAGON ||
            this.type == EntityType_1.EntityType.HAWK)
            this.info = 1;
        this.updateHealth(damager);
    }
    updateHealth(damager) {
        if (this.type == EntityType_1.EntityType.PLAYERS) {
            if (this.health != this.max_health && !this.ownerClass.questManager.checkQuestState(QuestType_1.QuestType.GREEN_CROWN)) {
                this.ownerClass.questManager.failQuest(QuestType_1.QuestType.GREEN_CROWN);
            }
        }
        if (this.god)
            return;
        if (this.health <= 0) {
            if (Utils_1.Utils.isBox(this) || Utils_1.Utils.isBuilding(this)) {
                this.ownerClass.onDead(damager);
                if (this.type == EntityType_1.EntityType.EMERALD_MACHINE) {
                    this.ownerClass.owner.health = 0;
                    this.ownerClass.owner.updateHealth(null);
                    if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                        if (damager.playerId != this.playerId) {
                            damager.gameProfile.score += (~~(this.ownerClass.owner.gameProfile.score / 5));
                        }
                    }
                }
            }
            if (this.type == EntityType_1.EntityType.TREASURE_CHEST) {
                let itemByChance = (0, ItemByChance_1.getItemByChance)(damager);
                let itemId = ItemIds_1.ItemIds[itemByChance];
                damager.inventory.addItem(itemId, 1);
                damager.gameProfile.score += 400;
                let killed = damager.stateManager.killedEntities[this.type]++;
                if (killed >= 5 && !damager.questManager.checkQuestState(QuestType_1.QuestType.ORANGE_CROWN)) {
                    damager.questManager.succedQuest(QuestType_1.QuestType.ORANGE_CROWN);
                }
            }
            if (Utils_1.Utils.isMob(this)) {
                if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                    let scoreGive = this.ownerClass.entitySettings.give_score ?? 0;
                    damager.gameProfile.score += scoreGive;
                }
            }
            if (this.type == EntityType_1.EntityType.PLAYERS) {
                if (damager && damager.type == EntityType_1.EntityType.PLAYERS) {
                    if (this.ownerClass.hat == 79) {
                        const writer_ = new bufferReader_1.BufferWriter(2);
                        writer_.writeUInt8(28);
                        writer_.writeUInt8(60);
                        this.ownerClass.controller.sendBinary(writer_.toBuffer());
                        (0, PvPTime_1.resolveKill)(damager, this.ownerClass);
                        damager.gameProfile.score += (~~(this.ownerClass.gameProfile.score / 5));
                        WorldEvents_1.WorldEvents.ghost(this.gameServer, this.ownerClass);
                        //  damager.callEntityUpdate(true);
                    }
                    else {
                        (0, PvPTime_1.resolveKill)(damager, this.ownerClass);
                        damager.gameProfile.score += (~~(this.ownerClass.gameProfile.score / 5));
                        WorldEvents_1.WorldEvents.playerDied(this.gameServer, this.ownerClass);
                        this.isDestroyed = true;
                    }
                }
                else {
                    if (this.ownerClass.hat == 79) {
                        const writer_ = new bufferReader_1.BufferWriter(2);
                        writer_.writeUInt8(28);
                        writer_.writeUInt8(60);
                        this.ownerClass.controller.sendBinary(writer_.toBuffer());
                        WorldEvents_1.WorldEvents.ghost(this.gameServer, this.ownerClass);
                        //  damager.callEntityUpdate(true)
                    }
                    else {
                        WorldEvents_1.WorldEvents.playerDied(this.gameServer, this.ownerClass);
                        this.isDestroyed = true;
                    }
                }
            }
            else {
                WorldEvents_1.WorldEvents.entityDied(this.gameServer, this);
                this.isDestroyed = true;
            }
            //if(!this.ownerClass.ghost)this.isDestroyed = true;
            //BEACH MOBS
            switch (this.type) {
                case EntityType_1.EntityType.CRAB:
                    this.gameServer.worldSpawner.crabs--;
                    break;
                case EntityType_1.EntityType.CRAB_BOSS:
                    this.gameServer.worldSpawner.crab_bosses--;
                    break;
            //FOREST MOBS
            case EntityType_1.EntityType.WOLF:
                this.gameServer.worldSpawner.wolfs--;
                    break;
            case EntityType_1.EntityType.SPIDER:
                this.gameServer.worldSpawner.spiders--;
                    break;
            case EntityType_1.EntityType.RABBIT:
                this.gameServer.worldSpawner.rabbits--;
                    break;
            case EntityType_1.EntityType.BOAR:
                this.gameServer.worldSpawner.boars--;
                    break;
            case EntityType_1.EntityType.HAWK:
                this.gameServer.worldSpawner.hawks--;
                    break; 
            //WINTER MOBS
                case EntityType_1.EntityType.DRAGON:
                    this.gameServer.worldSpawner.dragons--;
                    break;
                    case EntityType_1.EntityType.BABY_DRAGON:
                    this.gameServer.worldSpawner.baby_dragons--;
                    break;
                    case EntityType_1.EntityType.BEAR:
                    this.gameServer.worldSpawner.bears--;
                    break;
                    case EntityType_1.EntityType.FOX:
                    this.gameServer.worldSpawner.foxs--;
                    break;
                    case EntityType_1.EntityType.MAMMOTH:
                    this.gameServer.worldSpawner.mammoths--;
                    break;
                    case EntityType_1.EntityType.BABY_MAMMOTH:
                    this.gameServer.worldSpawner.baby_mammoths--;
                    break;
                    case EntityType_1.EntityType.PENGUIN:
                    this.gameServer.worldSpawner.penguins--;
                    break;
            //SEA MOBS
                case EntityType_1.EntityType.KRAKEN:
                    this.gameServer.worldSpawner.krakens--;
                    break;
                    case EntityType_1.EntityType.PIRANHA:
                        this.gameServer.worldSpawner.fishs--;
                        break;
                case EntityType_1.EntityType.TREASURE_CHEST:
                    this.gameServer.worldSpawner.treasure--;
                    break;
            //DESERT MOBS
            case EntityType_1.EntityType.VULTURE:
                this.gameServer.worldSpawner.vultures--;
                    break;
            case EntityType_1.EntityType.SAND_WORM:
                this.gameServer.worldSpawner.sand_worms--;
                    break;
            //LAVA MOBS
            case EntityType_1.EntityType.LAVA_DRAGON:
                this.gameServer.worldSpawner.lava_dragons--;
                    break;
            case EntityType_1.EntityType.BABY_LAVA:
                this.gameServer.worldSpawner.baby_lavas--;
                    break;
            case EntityType_1.EntityType.FLAME:
                this.gameServer.worldSpawner.flames--;
                    break;
            }
            ;
        }
    }
    updateBefore() {
        if (this.action & Action_1.Action.HURT)
            this.action &= ~Action_1.Action.HURT;
        if (this.action & Action_1.Action.COLD)
            this.action &= ~Action_1.Action.COLD;
        if (this.action & Action_1.Action.HEAL)
            this.action &= ~Action_1.Action.HEAL;
        if (this.action & Action_1.Action.HUNGER)
            this.action &= ~Action_1.Action.HUNGER;
        if (this.action & Action_1.Action.WEB)
            this.action &= ~Action_1.Action.WEB;
    }
    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
    updateSpeed() {
        this.speed = Math.max(1, this.speed);
    }
    update() {
        if (this.oldX != this.x)
            this.oldX = this.x;
        if (this.oldY != this.y)
            this.oldY = this.y;
        if (this.ownerClass)
            this.ownerClass.onEntityUpdate(performance.now());
        if (Utils_1.Utils.isPlayer(this)) {
            this.ownerClass.tickUpdate(); //aaa22
            let itemsArray2 = this.ownerClass.inventory.toArray();
            // FLOWER AFK MARK
            if (Math.floor(this.x / 100) == 14 && Math.floor(this.y / 100) == 41) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.FLOWER_HAT) {
                        this.extra = 0;
                        this.isFly = false;
                        this.speed = 24;
                        this.max_speed = this.speed;
                        this.x = 9650;
                        this.y = 3250;
                    }
                }
            }
            //WINTER BIOME TP
            if (Math.floor(this.x / 100) == 31 && Math.floor(this.y / 100) == 51) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.extra = 0;
                        this.isFly = false;
                        this.speed = 24;
                        this.max_speed = this.speed;
                        this.x = 4895;
                        this.y = 6699;
                    }
                }
            }
            // WINTER OUT TP
            if (Math.floor(this.x / 100) == 58 && Math.floor(this.y / 100) == 66) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                this.x = 3200, this.y = 3200;
            }
            // SHOP TRADE GEM MARK
            if (Math.floor(this.x / 100) == 14 && Math.floor(this.y / 100) == 18) {
                        this.extra = 0;
                        this.isFly = false;
                        this.speed = 24;
                        this.max_speed = this.speed;
                        this.x = 717;
                        this.y = 2063;
                    
                
            }
        
            // SPAWN LAVA PROTECTION
         /*   if (this.x >= 6100 && this.y >= 1000 && this.x <= 6800 && this.y <= 1900) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                if (this.isFly)
                    this.x = 3200, this.y = 3200;
            }*/
            // LAVA SPAWN HEAL
         //   if (Math.floor(this.x / 100) == 64 && Math.floor(this.y / 100) == 14) {
         //       this.health += 200;
         //       this.ownerClass.gaugesManager.healthUpdate();
         //   }
            // LAVA SPAWN TP TO MID
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.BOTTLE_EMPTY) {
                        this.extra = 0;
                        this.isFly = false;
                        this.speed = 24;
                        this.max_speed = this.speed;
                        this.x = 800;
                        this.y = 600;
                        this.health = 200
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.BOTTLE_EMPTY, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.BOTTLE_FULL, Number(1));
                        
                    }
                }
            
            // BOTTLE SPOT : protection
            if (this.x >= 300 && this.y >= 500 && this.x <= 1000 && this.y <= 800) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                if (this.isFly)
                    this.x = 3200, this.y = 3200;
            }
            if (Math.floor(this.x / 100) == 8 && Math.floor(this.y / 100) == 6) {
                this.health += 200;
                this.ownerClass.gaugesManager.healthUpdate();
            }
            if (Math.floor(this.x / 100) == 4 && Math.floor(this.y / 100) == 6) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                this.x = 3200, this.y = 3200;
            }
            // FLOWER SPOT : protection
            if (this.x >= 9000 && this.y >= 3100 && this.x <= 9800 && this.y <= 3500) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                if (this.isFly)
                    this.x = 3200, this.y = 3200;
            }
            if (Math.floor(this.x / 100) == 96 && Math.floor(this.y / 100) == 32) {
                this.health += 200;
                this.ownerClass.gaugesManager.healthUpdate();
            }
            if (Math.floor(this.x / 100) == 92 && Math.floor(this.y / 100) == 32) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                this.x = 3200, this.y = 3200;
            }
            // MID SPOT FOR ITEMS !
       /*     if (Math.floor(this.x / 100) == 32 && Math.floor(this.y / 100) == 32) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.WATERING_CAN_FULL) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.WATERING_CAN_FULL, Number(1));
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.COOKED_MEAT, Number(50));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.DRAGON_SWORD, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.DRAGON_SPEAR, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.HAMMER_GOLD, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.GOLD_SPIKE, Number(3));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.DRAGON_HELMET, Number(1));
                    }
                }
            }*/
            // MID HEAL
          //  if (Math.floor(this.x / 100) == 32 && Math.floor(this.y / 100) == 32) {
           //     this.health += 200;
          //      this.ownerClass.gaugesManager.healthUpdate();
         //   }
            // HERE ALL MARKS OF ZMA !
            // MARK 1 BERRY
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 17) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.PEASANT, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.SEED, Number(10));
                    }
                }
            }
            // MARK 2 TREE (WOOD_BOW)
            /* if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 19) {
                 for (let i = 0; i < itemsArray2.length; i++) {
                
                     if (itemsArray2[i][0] == ItemIds.GEMME_ORANGE) {
                     this.ownerClass.inventory.removeItem(ItemIds.GEMME_ORANGE,Number(1));
                     this.ownerClass.inventory.addItem(ItemIds.WOOD_BOW,Number(1));
                     this.ownerClass.inventory.addItem(ItemIds.WOOD_ARROW,Number(5))
                     }
                 }
             } */
            // MARK 3 STONE
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 21) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.PILOT_HELMET, Number(1));
                    }
                }
            }
            // MARK 4 GOLD
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 23) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.CRAB_BOSS, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.CRAB_SPEAR, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.CROWN_CRAB, Number(1));
                    }
                }
            }
            // MARK 5 DIAMOND (DIA BOW)
            /*   if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 25) {
                   for (let i = 0; i < itemsArray2.length; i++) {
                  
                       if (itemsArray2[i][0] == ItemIds.GEMME_ORANGE) {
                       this.ownerClass.inventory.removeItem(ItemIds.GEMME_ORANGE,Number(1));
                       this.ownerClass.inventory.addItem(ItemIds.DIAMOND_BOW,Number(1));
                       this.ownerClass.inventory.addItem(ItemIds.DIAMOND_ARROW,Number(5))
                       }
                   }
               } */
            // MARK 6 AMETHYST
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 36) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.SADDLE, Number(1));
                    }
                }
            }
            // MARK 7 REIDITE (LEFT BOW REIDITE)
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 38) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_HELMET, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPEAR, Number(1));
                    }
                }
            }
            // MARK 8 EMERALD (Reidite bow x1 and tower x5 )
            /*  if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 40) {
                  for (let i = 0; i < itemsArray2.length; i++) {
                 
                      if (itemsArray2[i][0] == ItemIds.GEMME_ORANGE) {
                      this.ownerClass.inventory.removeItem(ItemIds.GEMME_ORANGE,Number(1));
                      this.ownerClass.inventory.addItem(ItemIds.REIDITE_BOW,Number(1));
                      this.ownerClass.inventory.addItem(ItemIds.REIDITE_ARROW,Number(5))
                      }
                  }
              } */
            // MARK 9 LAVA POOL (Well x1 + Seal with water x5)
            if (Math.floor(this.x / 100) == 50 && Math.floor(this.y / 100) == 42) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.DRAGON_ORB, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.WELL, Number(1));
                    }
                }
            }
            // MARK 10 REIDITE TRAP
            if (Math.floor(this.x / 100) == 4 && Math.floor(this.y / 100) == 19) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.GEMME_GREEN, Number(2));
                    }
                }
            }
            // MARK 11 EMERALD TRAP
            if (Math.floor(this.x / 100) == 4 && Math.floor(this.y / 100) == 21) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_GREEN) {
                        this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_GREEN, Number(2));
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
                    }
                }
            }
            // TRAP TP
            if (Math.floor(this.x / 100) == 8 && Math.floor(this.y / 100) == 18) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                this.x = 3200, this.y = 3200;
            }
            // MARK 12 EMERALD FARM
            if (Math.floor(this.x / 100) == 39 && Math.floor(this.y / 100) == 53) {
                for (let i = 0; i < itemsArray2.length; i++) {
                    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GREEN_CROWN) {
                        this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.PICK_REIDITE, Number(1));
                    }
                }
            }
            // EMERALD FARM OUT TP 
            if (Math.floor(this.x / 100) == 44 && Math.floor(this.y / 100) == 53) {
                let bro = this.ownerClass.gameServer.worldSpawner.findFirstLocation();
                this.x = 3200, this.y = 3200;
            }


           // MARK 13 LAVA ITEMS
    if (Math.floor(this.x / 100) == 82 && Math.floor(this.y / 100) == 32 && !this.isFly) {
        if (!this.ChanceKitClaimed) {
            this.ChanceKitClaimed = 1;
            const options = [
                { name: "REIDITE_SPEAR", probability: 0.35 },
                { name: "REIDITE_SWORD", probability: 0.35 },
                { name: "REIDITE_WALL", probability: 0.1 },
                { name: "REIDITE_SPIKE", probability: 0.1 },
                { name: "REIDITE_DOOR_SPIKE", probability: 0.072 },
                { name: "BOTTLE_FULL", probability: 0.001 },
                { name: "CRAB_SPEAR", probability: 0.001 },
                { name: "GEMME_ORANGE", probability: 0.001 },
                { name: "GEMME_BLUE", probability: 0.001 },
                { name: "HAWK", probability: 0.001 },
                { name: "DIAMOND_HELMET", probability: 0.001 },
                { name: "SWORD_DIAMOND", probability: 0.001 },
                { name: "CROWN_BLUE", probability: 0.001 },
            ];
            function getRandomItemByProbability(options) {
                const randomValue = Math.random();
                let cumulativeProbability = 0;
                for (const option of options) {
                    cumulativeProbability += option.probability;
                    if (randomValue <= cumulativeProbability) {
                        return option.name;
                    }
                }
                return "FIREFLY";
            }
            const selectedOption = getRandomItemByProbability(options);
            this.ownerClass.inventory.addItem(ItemIds_1.ItemIds[selectedOption], Number(1));
        }
    }
        // MARK 14 LAVA KIT ITEMS

if (Math.floor(this.x / 100) == 88 && Math.floor(this.y / 100) == 32) {
  let hasAllItems = true;

  for (let i = 0; i < itemsArray2.length; i++) {
    if (itemsArray2[i][0] == ItemIds_1.ItemIds.GEMME_ORANGE) {
      this.ownerClass.inventory.removeItem(ItemIds_1.ItemIds.GEMME_ORANGE, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_HELMET, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SPEAR, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_SWORD, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_BOW, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.REIDITE_ARROW, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.HAMMER_REIDITE, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.WOOD_TOWER, Number(5));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.ROOF, Number(20));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.BRIDGE, Number(20));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.TOTEM, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.SPANNER, Number(1));
      this.ownerClass.inventory.addItem(ItemIds_1.ItemIds.DRAGON_CUBE, Number(1))
    } else {
      
      break;
    }
  }

  if (hasAllItems) {
    //const placeBuild = ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE
    this.x = 3200, this.y = 3200;

    //this.ownerClass.placeBuild(ItemIds_1.ItemIds.REIDITE_DOOR_SPIKE, this.x = 8543, this.y = 3252);

  }
}}


































































        // console.log(!this.ownerClass.isStunned);
        if (Utils_1.Utils.isPlayer(this)) {
            if (this.vector.x != 0 || this.vector.y != 0) {
                //  this.ownerClass.updateStun();
                this.x += this.vector.x;
                this.y += this.vector.y;
                if (!this.ownerClass.ghost)
                    CollisionUtils_1.CollisionUtils.scheduleCollision(this);
                //  this.ownerClass.ISF = true;
                //   console.log(this.ownerClass.ISF);
            }
            else {
                this.ISF = false;
            }
        }
        if (this.oldX != this.x || this.oldY != this.y) {
            WorldBiomeResolver_1.WorldBiomeResolver.update_dist_in_biomes(this);
            this.biomeIn = WorldBiomeResolver_1.WorldBiomeResolver.get_biome_id(this);
        }
        this.updateBounds();
        this.updateSpeed();
        // AFK SPOT
        if (this.x >= 0 && this.x <= 400 && this.y >= 2700 && this.y <= 3600 && performance.now() - this.date > 100) {
            if (this.type == 0) {
                this.date = performance.now();
                this.health += 200;
                this.ownerClass.gaugesManager.healthUpdate();
            }
        }
    }
    updateBounds() {
        const map = {
            maxx: serverconfig_json_1.default.world.Width - 15,
            maxy: serverconfig_json_1.default.world.Height - 15,
            minx: 15,
            miny: 15
        };
        // if (this.type === EntityType.WOLF || this.type === EntityType.RABBIT || this.type === EntityType.SPIDER) {
        //    map.maxx -= 300;
        //    map.maxy -= 300;
        //    map.minx += 300;
        //    map.miny += 300;
        // }
        this.x = ~~Math.min(map.maxx, Math.max(map.minx, this.x));
        this.y = ~~Math.min(map.maxy, Math.max(map.miny, this.y));
    }
}
exports.Entity = Entity;
