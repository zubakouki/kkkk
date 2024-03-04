"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const EntityType_1 = require("../enums/EntityType");
const Utils_1 = require("../utils/Utils");
const Entity_1 = require("./Entity");
const Action_1 = require("../enums/Action");
const EntityUtils_1 = require("../utils/EntityUtils");
const Biomes_1 = require("../enums/Biomes");
const ServerConfig_1 = require("../settings/serverconfig.json");
class Animal extends Entity_1.Entity {
    lastMove = -1;
    lastStay = -1;
    stayCooldown = -1;
    lastInfoUpdate = -1;
    lastUpdate = -1;
    target;
    isMobStay = false;
    entitySettings;
    old_x = 0;
    old_y = 0;
    factoryOf = "animal";
    forestX1 = 0;
    forestX2 = 0;
    forestY1 = 0;
    forestY2 = 0;
    constructor(id, gameServer) {
        super(id, 0, gameServer);
    }
    onEntityUpdate(now) {
        switch (this.type) {
            case EntityType_1.EntityType.KRAKEN: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.DRAGON: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.LAVA_DRAGON: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.BABY_LAVA: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.BABY_DRAGON: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.MAMMOTH: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
            case EntityType_1.EntityType.BABY_MAMMOTH: {
                if (now - this.lastUpdate > 950) {
                    this.lastUpdate = now;
                    const entities = this.gameServer.queryManager.queryBuildings(this.x, this.y, this.radius);
                    for (let i = 0; i < entities.length; i++) {
                        const _entity = entities[i];
                        _entity.receiveHit(this, this.entitySettings.damage);
                    }
                }
                break;
            }
        }
        if (this.isMobStay && now - this.lastMove > (this.target ? 220 : 1000)) {
            this.target = Utils_1.Utils.getNearestInRange(this, 250);
            if (this.target != null) {
                let entity = this.target.entity;
                let angleDiff = Utils_1.Utils.angleDiff(this.x, this.y, entity.x, entity.y);
                let correctAngle = ((angleDiff) - (this.type === EntityType_1.EntityType.RABBIT ? Math.PI / 2 : -Math.PI / 2));
                this.angle = Utils_1.Utils.calculateAngle255(correctAngle);
                if (!entity.isFly) {
                    if (this.type == EntityType_1.EntityType.SPIDER) {
                        if (!entity.isStunned && this.target.dist < 170) {
                            if (Math.random() > .9) {
                                entity.isStunned = true;
                                entity.lastStun = now;
                                entity.action |= Action_1.Action.WEB;
                            }
                        }
                    }
                    if (this.type == EntityType_1.EntityType.PENGUIN) {
                        let correctAngle = ((angleDiff) - (this.type === EntityType_1.EntityType.PENGUIN ? Math.PI / 2 : -Math.PI / 2));
                        this.angle = Utils_1.Utils.calculateAngle255(correctAngle);
                    }
                    if (this.type != EntityType_1.EntityType.RABBIT && now - entity.stateManager.lastAnimalsHit[this.type] > 500)
                    if (this.type != EntityType_1.EntityType.PENGUIN && now - entity.stateManager.lastAnimalsHit[this.type] > 500)
                    
                        this.onAttack(now);
                }
            }
            else {
                this.angle = Utils_1.Utils.randomMaxMin(0, 255);
            }
            this.lastStay = now;
            this.isMobStay = false;
        }
        if (!this.isMobStay && now - this.lastStay > this.stayCooldown) {
            this.stayCooldown = this.target ? 430 : Utils_1.Utils.randomMaxMin(0, 1000);
            this.isMobStay = true;
            this.lastMove = now;
        }
        this.updateMovement();
    }
    ;
    onAttack(now) {
        const entity = this.target.entity;
        if (!Utils_1.Utils.isCirclesCollides(this.x, this.y, entity.x, entity.y, this.radius, entity.radius + 15)) {
            return;
        }
        entity.receiveHit(this, this.entitySettings.damage); //
        entity.stateManager.lastAnimalsHit[this.type] = now;
    }
    updateMovement() {
        if (this.isMobStay ||
            this.target && Utils_1.Utils.distanceSqrt(this.x, this.y, this.target.entity.x, this.target.entity.y) < this.entitySettings.hitbox_size)
            return;
        let angle = Utils_1.Utils.referenceAngle(this.angle) + Math.PI / 2;
        let x = this.x + Math.cos(angle) * this.speed;
        let y = this.y + Math.sin(angle) * this.speed;
        if (this.isCollides(x, y, this.entitySettings.hitbox_size)) {
            this.angle = Utils_1.Utils.randomMaxMin(0, 255);
            return;
        }
        this.old_x = this.x;
        this.old_y = this.y;
        this.x = x;
        this.y = y;
        //FOREST
        this.forestX1 = ServerConfig_1.ForestPositions.ForestX1;
        this.forestX2 = ServerConfig_1.ForestPositions.ForestX2;
        this.forestY1 = ServerConfig_1.ForestPositions.ForestY1;
        this.forestY2 = ServerConfig_1.ForestPositions.ForestY2;
        //CAVE
        this.caveX1 = ServerConfig_1.CavePositions.CaveX1;
        this.caveX2 = ServerConfig_1.CavePositions.CaveX2;
        this.caveY1 = ServerConfig_1.CavePositions.CaveY1;
        this.caveY2 = ServerConfig_1.CavePositions.CaveY2;
        //WINTER
        this.winterX1 = ServerConfig_1.WinterPositions.WinterX1;
        this.winterX2 = ServerConfig_1.WinterPositions.WinterX2;
        this.winterY1 = ServerConfig_1.WinterPositions.WinterY1;
        this.winterY2 = ServerConfig_1.WinterPositions.WinterY2;
        //SEA
        this.seaX1 = ServerConfig_1.SeaPositions.SeaX1;
        this.seaX2 = ServerConfig_1.SeaPositions.SeaX2;
        this.seaY1 = ServerConfig_1.SeaPositions.SeaY1;
        this.seaY2 = ServerConfig_1.SeaPositions.SeaY2;
        //DESERT
        this.desertX1 = ServerConfig_1.DesertPositions.DesertX1;
        this.desertX2 = ServerConfig_1.DesertPositions.DesertX2;
        this.desertY1 = ServerConfig_1.DesertPositions.DesertY1;
        this.desertY2 = ServerConfig_1.DesertPositions.DesertY2;
        //LAVA
        this.lavaX1 = ServerConfig_1.LavaPositions.LavaX1;
        this.lavaX2 = ServerConfig_1.LavaPositions.LavaX2;
        this.lavaY1 = ServerConfig_1.LavaPositions.LavaY1;
        this.lavaY2 = ServerConfig_1.LavaPositions.LavaY2;
        switch (this.type) {
            //FOREST
            case EntityType_1.EntityType.WOLF: {
                if(this.x <= this.forestX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.forestX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.forestY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.forestY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.SPIDER: {
                if(this.x <= this.forestX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.forestX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.forestY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.forestY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.RABBIT: {
                if(this.x <= this.forestX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.forestX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.forestY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.forestY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.CRAB: {
                if(this.x <= this.forestX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.forestX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.forestY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.forestY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.HAWK: {
                if(this.x <= this.forestX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.forestX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.forestY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.forestY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            //CAVE
            case EntityType_1.EntityType.DRAGON: {
                    if(this.x <= this.caveX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.caveX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.caveY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.caveY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.BABY_DRAGON: {
                    if(this.x <= this.caveX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.caveX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.caveY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.caveY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                // WINTER
                case EntityType_1.EntityType.MAMMOTH: {
                    if(this.x <= this.winterX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.winterX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.winterY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.winterY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.BABY_MAMMOTH: {
                    if(this.x <= this.winterX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.winterX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.winterY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.winterY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.FOX: {
                    if(this.x <= this.winterX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.winterX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.winterY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.winterY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.BEAR: {
                    if(this.x <= this.winterX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.winterX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.winterY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.winterY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.PENGUIN: {
                    if(this.x <= this.winterX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.winterX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.winterY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.winterY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                //SEA
                case EntityType_1.EntityType.KRAKEN: {
                    if(this.x <= this.seaX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.seaX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.seaY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.seaY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
                case EntityType_1.EntityType.PIRANHA: {
                    if(this.x <= this.seaX1)
                    {   
                                this.x += 100
                                this.angle = 180
                   }
                    if(this.x >= this.seaX2)
                    {
                                this.x -= 100
                                this.angle = 70
                    }
                    if(this.y <= this.seaY1)
                    {
                                this.y += 100
                                this.angle = 0
                    }
                    if(this.y >= this.seaY2)
                    {
                                this.y -= 100
                                this.angle = 70
                    }
                    break;
                   
                }
            //DESERT
            case EntityType_1.EntityType.VULTURE: {
                if(this.x <= this.desertX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.desertX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.desertY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.desertY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.SAND_WORM: {
                if(this.x <= this.desertX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.desertX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.desertY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.desertY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            //LAVA
            case EntityType_1.EntityType.LAVA_DRAGON: {
                if(this.x <= this.lavaX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.lavaX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.lavaY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.lavaY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.BABY_LAVA: {
                if(this.x <= this.lavaX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.lavaX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.lavaY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.lavaY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
            case EntityType_1.EntityType.FLAME: {
                if(this.x <= this.lavaX1)
                {   
                            this.x += 100
                            this.angle = 180
               }
                if(this.x >= this.lavaX2)
                {
                            this.x -= 100
                            this.angle = 70
                }
                if(this.y <= this.lavaY1)
                {
                            this.y += 100
                            this.angle = 0
                }
                if(this.y >= this.lavaY2)
                {
                            this.y -= 100
                            this.angle = 70
                }
                break;
               
            }
        }
        /*if(Utils.isInIsland(this)) {
            let angleDiff = Utils.angleDiff(this.x, this.y, this.old_x, this.old_y);
            this.angle = Utils.calculateAngle255(angleDiff);

            angle = angleDiff + Math.PI / 2;

            x = this.x + Math.cos(angle) * 80;
            y = this.y + Math.sin(angle) * 80;
        }*/
        this.old_x = this.x;
        this.old_y = this.y;
        this.x = x;
        this.y = y;
    }
    isAllowedBiome(type) {
        for (let i = 0; i < this.entitySettings.allowedBiomes.length; i++) {
            let biome = this.entitySettings.allowedBiomes[i];
            //@ts-ignore
            if (Biomes_1.Biomes[biome] == type)
                return true;
        }
        return false;
    }
    onSpawn(x, y, angle, type) {
        this.initEntityData(x, y, angle, type, false);
        this.info = 1;
        ////
        this.entitySettings = (0, EntityUtils_1.getEntity)(type);
        this.old_x = x;
        this.old_y = y;
        switch (type) {
            // BEACH MOBS
            case EntityType_1.EntityType.CRAB_BOSS:
                this.max_speed = 26;
                this.speed = this.max_speed;
                this.radius = 50;
                this.health = 3000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.CRAB:
                this.max_speed = 28;
                this.speed = this.max_speed;
                this.radius = 15;
                this.health = 240;
                this.max_health = this.health;
                break;
            // FOREST MOBS
            case EntityType_1.EntityType.RABBIT:
                this.max_speed = 32;
                this.speed = this.max_speed;
                this.radius = 15;
                this.health = 60;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.WOLF:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 30;
                this.health = 1000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.SPIDER:
                this.max_speed = 24;
                this.speed = this.max_speed;
                this.radius = 30;
                this.health = 1500;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BOAR:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 50;
                this.health = 600;
                this.old_health = this.health;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.HAWK:
                this.max_speed = 28;
                this.speed = this.max_speed;
                this.radius = 30;
                this.health = 300;
                this.max_health = this.health;
                break;
            // SEA MOBS
            case EntityType_1.EntityType.KRAKEN:
                this.max_speed = 30;
                this.speed = this.max_speed;
                this.radius = 100;
                this.health = 6000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.PIRANHA:
                this.max_speed = 30;
                this.speed = this.max_speed;
                this.radius = 29;
                this.health = 300;
                this.max_health = this.health;
                break;
            // CAVE MOBS
            case EntityType_1.EntityType.DRAGON:
                this.max_speed = 28;
                this.speed = this.max_speed;
                this.radius = 100;
                this.health = 5000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                this.max_speed = 28;
                this.speed = this.max_speed;
                this.radius = 60;
                this.health = 1200;
                this.max_health = this.health;
                break;
            // WINTER MOBS
            case EntityType_1.EntityType.FOX:
                this.max_speed = 28;
                this.speed = this.max_speed;
                this.radius = 40;
                this.health = 1200;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BEAR:
                this.max_speed = 32;
                this.speed = this.max_speed;
                this.radius = 60;
                this.health = 1200;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.MAMMOTH:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 100;
                this.health = 3000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BABY_MAMMOTH:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 60;
                this.health = 1200;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.PENGUIN:
                this.max_speed = 32;
                this.speed = this.max_speed;
                this.radius = 15;
                this.health = 1200;
                this.max_health = this.health;
                break;
            // DESERT MOBS
            case EntityType_1.EntityType.VULTURE:
                this.max_speed = 29;
                this.speed = this.max_speed;
                this.radius = 50;
                this.health = 600;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.SAND_WORM:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 45;
                this.health = 1500;
                this.max_health = this.health;
                break;
            // LAVA MOBS
            case EntityType_1.EntityType.LAVA_DRAGON:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 100;
                this.health = 3000;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.BABY_LAVA:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 60;
                this.health = 1500;
                this.max_health = this.health;
                break;
            case EntityType_1.EntityType.FLAME:
                this.max_speed = 27;
                this.speed = this.max_speed;
                this.radius = 40;
                this.health = 1200;
                this.max_health = this.health;
                break;            
        }
    }
}
exports.Animal = Animal;
