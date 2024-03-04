"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldEvents = void 0;
const Player_1 = require("../entity/Player");
const EntityType_1 = require("../enums/EntityType");
const PacketType_1 = require("../enums/PacketType");
const Utils_1 = require("../utils/Utils");
const EntityUtils_1 = require("../utils/EntityUtils");
const DieReason_1 = require("../enums/DieReason");
const bufferReader_1 = require("../utils/bufferReader");
const Box_1 = require("../entity/Box");
const EntityUtils_2 = require("../utils/EntityUtils");
const ItemIds_1 = require("../enums/ItemIds");
const Logger_1 = require("../logs/Logger");
class WorldEvents {
    /**
     * Calls when socket verified and joined
     */
    static registerPlayer(controller, handshake, tokenScore) {
        const gameServer = controller.gameServer;
        const id = gameServer.playerPool.nextId();
        const player = new Player_1.Player(controller, id, gameServer, tokenScore, handshake.token, handshake.token_id);
        player.radius = controller.gameServer.gameConfiguration.entities.player.hitbox_size;
        player.max_speed = controller.gameServer.gameConfiguration.entities.player.speed_forest_default;
        player.speed = controller.gameServer.gameConfiguration.entities.player.speed_forest_default;
        const pos = gameServer.worldSpawner.findFirstLocation();
        let x = pos != null ? pos[0] : 2500, y = pos != null ? pos[1] : 2500, angle = 0;
        //cy = 1250 + ~~(Math.random() * (this.gameServer.gameConfiguration.world.Height - 2500));
        //let x = 3200 + ~~(Math.random() * 5000 - 3200), y =3200 + ~~(Math.random() * 5000 - 3200) , angle = 0;
        //let x = 2500 + ~~(Math.random() * 7000 - 2500), y =2500 + ~~(Math.random() * 7000 - 2500) , angle = 0;
        /**
         * Adding player to gameServer
         */
        gameServer.players.set(id, player);
        gameServer.initLivingEntity(player);
        player.initOwner(player);
        player.gameProfile.name = handshake.name;
        player.abstractType = EntityUtils_1.EntityAbstractType.LIVING;
        //player.isAdmin = true;
        //  if (serverConfig.viplist.price2.has(player.controller.userIp)) player.isAdmin = true, player.ism = true;
        //player.isAdmin = true;
        // if(ENV_MODE == MODES.TEST || ENV_MODE == MODES.DEV) {
        //     x = 8300;
        //     y = 5300;
        //     player.isAdmin = true;
        // }w
        // x = 9600;
        // y = 9800;
        //
        /**
         * Init entity stuff
         */
        player.initEntityData(x, y, angle, EntityType_1.EntityType.PLAYERS, false);
        /**
         * Sending to socket handshake response
         */
        player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.Handshake, ...Utils_1.Utils.backInHandshake(player, handshake, tokenScore)]);
        /**
         * We sends everyone that player Joinedand after you add this, can you add underneath kills=fireflies

#FF69B4: DM: goozrr ON DISCORD FOR REFUND OR PROBLEMS
then make kit booster hammer 1 instead of 9999
         */
        player.controller.sendJSON([PacketType_1.ServerPacketTypeJson.ServerDescription, "#FBDA2C ====================\n#ff0000 Welcome to ZMA [EUROPE] \n#ff0000 Owner Sasuke Dev : SoowZz \n#00ffaf Kills = Fireflies \n#3454FB Our Discord: discord.gg/colddfun \n#3454FB wand 10kills wand2 25kills \n#3454FB turban 30kills Ninja 50kills \n#3454FB Orange gem 50kills blue gem 100kills \n#3454FB dragon can make with SADDLE \n#3454FB Totem Max Players = 16 ENJOYY \n#FBDA2C ===================="]);
        gameServer.broadcastJSON([
            PacketType_1.ServerPacketTypeJson.NewPlayer,
            player.playerId,
            player.gameProfile.name,
            player.gameProfile.skin,
            player.gameProfile.accessory,
            player.gameProfile.baglook,
            player.gameProfile.book,
            player.gameProfile.box,
            player.gameProfile.deadBox,
            player.gameProfile.kills
        ], player.playerId);
        if (player.bag)
            player.inventory.getBag();
        Logger_1.Loggers.game.info(`Player with Id ${player.id} joined as ${player.gameProfile.name} with ${player.controller.userIp}`);
        return player;
    }
    /**
     * LeaderboardUpdate calls every 5secs
     */
    static sendLeaderboardUpdate(gameServer) {
        const playersArray = [];
        for (const player of gameServer.players.values()) {
            playersArray.push([player.playerId, player.gameProfile.score]);
            player.gameServer.broadcastBinary(Buffer.from([PacketType_1.ServerPacketTypeBinary.VerifiedAccount, player.id, player.gameProfile.skin, player.gameProfile.accessory, player.gameProfile.baglook, player.gameProfile.book, player.gameProfile.box, player.gameProfile.deadBox, player.gameProfile.kills]));
        }
        gameServer.broadcastJSON([PacketType_1.ServerPacketTypeJson.LeaderboardUpdate, playersArray]);
    }
    static onTotemBreak(entity) {
        const writer = new bufferReader_1.BufferWriter(1);
        writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.TeamIsDestroyed);
        for (let i = 0; i < entity.data.length; i++) {
            const player = entity.data[i];
            player.controller.sendBinary(writer.toBuffer());
            player.totemFactory = null;
            player.lastTotemCooldown = performance.now();
        }
    }
    static addBox(owner, type, loot) {
        const gameServer = owner.gameServer;
        const id = gameServer.entityPool.nextId();
        const box = new Box_1.Box(id, owner, gameServer);
        const info = owner instanceof Player_1.Player ? type == EntityType_1.EntityType.CRATE ? owner.gameProfile.box : owner.gameProfile.deadBox : Utils_1.Utils.getBoxSkin(owner.type);
        box.onSpawn(owner.x, owner.y, owner.angle, type, info);
        box.radius = 30;
        for (let i = 0; i < loot.length; i++) {
            box.setLoot(loot[i][0], loot[i][1]);
        }
        ;
        box.initOwner(box);
        gameServer.initLivingEntity(box);
    }
    /**
     * Player died event
     */
    static playerDied(gameServer, entity) {
        if (!(!entity.ownerClass.totemFactory || entity.ownerClass.id == entity.ownerClass.totemFactory.playerId)) {
            const writer = new bufferReader_1.BufferWriter(2);
            writer.writeUInt8(PacketType_1.ServerPacketTypeBinary.ExcludeTeam);
            writer.writeUInt8(entity.ownerClass.id);
            for (let i = 0; i < entity.ownerClass.totemFactory.data.length; i++) {
                const player = entity.ownerClass.totemFactory.data[i];
                player.controller.sendBinary(writer.toBuffer());
            }
            entity.ownerClass.totemFactory.data = entity.ownerClass.totemFactory.data.filter((e) => e.id != entity.ownerClass.id);
            entity.ownerClass.totemFactory = null;
        }
        entity.controller.sendJSON([PacketType_1.ServerPacketTypeJson.KillPlayer, DieReason_1.DieReason.PLAYER_KILLED, entity.gameProfile.score, entity.gameProfile.kills]);
        entity.controller.closeSocket();
        gameServer.worldDeleter.initEntity(entity, "player");
        gameServer.players.delete(entity.id);
        WorldEvents.addBox(entity, EntityType_1.EntityType.DEAD_BOX, entity.inventory.toArray());
        if (entity.tokenScore.session_id === entity.gameProfile.token_id) {
            entity.tokenScore.score += entity.gameProfile.score;
            entity.tokenScore.session_id = 0;
            gameServer.tokenManager.leaveToken(entity.tokenScore);
        }
        gameServer.leaderboard.writeLb({
            name: entity.gameProfile.name,
            score: Math.floor(entity.gameProfile.score),
            kills: Math.floor(entity.gameProfile.kills),
            days: Math.floor(entity.gameProfile.days)
        });
    }
    static ghost(gameServer, entity) {
        entity.gameProfile.score -= entity.gameProfile.score / 5;
        var list = [ItemIds_1.ItemIds.SUPER_HAMMER, ItemIds_1.ItemIds.DRAGON_HEART, ItemIds_1.ItemIds.SWORD_WOOD, ItemIds_1.ItemIds.SWORD, ItemIds_1.ItemIds.SWORD_GOLD, ItemIds_1.ItemIds.SWORD_DIAMOND, ItemIds_1.ItemIds.SWORD_AMETHYST, ItemIds_1.ItemIds.REIDITE_SWORD, ItemIds_1.ItemIds.DRAGON_SWORD, ItemIds_1.ItemIds.LAVA_SWORD, ItemIds_1.ItemIds.PIRATE_SWORD, ItemIds_1.ItemIds.SPEAR, ItemIds_1.ItemIds.WOOD_SPEAR, ItemIds_1.ItemIds.GOLD_SPEAR, ItemIds_1.ItemIds.DIAMOND_SPEAR, ItemIds_1.ItemIds.AMETHYST_SPEAR, ItemIds_1.ItemIds.REIDITE_SPEAR, ItemIds_1.ItemIds.DRAGON_SPEAR, ItemIds_1.ItemIds.LAVA_SPEAR, ItemIds_1.ItemIds.CRAB_SPEAR, ItemIds_1.ItemIds.WOOD_BOW, ItemIds_1.ItemIds.STONE_BOW, ItemIds_1.ItemIds.GOLD_BOW, ItemIds_1.ItemIds.DIAMOND_BOW, ItemIds_1.ItemIds.AMETHYST_BOW, ItemIds_1.ItemIds.REIDITE_BOW, ItemIds_1.ItemIds.DRAGON_BOW, ItemIds_1.ItemIds.WOOD_SHIELD, ItemIds_1.ItemIds.STONE_SHIELD, ItemIds_1.ItemIds.GOLD_SHIELD, ItemIds_1.ItemIds.DIAMOND_SHIELD, ItemIds_1.ItemIds.AMETHYST_SHIELD, ItemIds_1.ItemIds.REIDITE_SHIELD, ItemIds_1.ItemIds.WAND1, ItemIds_1.ItemIds.WAND2, ItemIds_1.ItemIds.PICK_WOOD, ItemIds_1.ItemIds.PICK, ItemIds_1.ItemIds.PICK_GOLD, ItemIds_1.ItemIds.PICK_DIAMOND, ItemIds_1.ItemIds.PICK_AMETHYST, ItemIds_1.ItemIds.PICK_REIDITE, ItemIds_1.ItemIds.SPANNER, ItemIds_1.ItemIds.PITCHFORK, ItemIds_1.ItemIds.PITCHFORK2];
        list.forEach((e) => {
            entity.inventory.removeItem(e, entity.inventory.countItem(e), true);
        });
        entity.ghost = true;
        entity.health = 200;
        entity.gaugesManager.healthUpdate();
        entity.hat = 0;
        entity.right = 2; //ItemIds.HAND;
        entity.updateInfo();
        //  entity.callEntityUpdate(true);
        let publ = setTimeout(() => {
            if (entity.ghost) {
                entity.ghost = false;
                // entity.updateInfo();
                //entity.callEntityUpdate(false);
                gameServer.worldDeleter.initEntity(entity, "player");
                gameServer.players.delete(entity.id);
                WorldEvents.addBox(entity, EntityType_1.EntityType.DEAD_BOX, entity.inventory.toArray());
                if (entity.tokenScore.session_id === entity.gameProfile.token_id) {
                    entity.tokenScore.score += entity.gameProfile.score;
                    entity.tokenScore.session_id = 0;
                    gameServer.tokenManager.leaveToken(entity.tokenScore);
                }
                ;
                entity.controller.sendJSON([PacketType_1.ServerPacketTypeJson.KillPlayer, DieReason_1.DieReason.PLAYER_KILLED, entity.gameProfile.score, entity.gameProfile.kills]);
                entity.controller.closeSocket();
                gameServer.leaderboard.writeLb({
                    name: entity.gameProfile.name,
                    score: Math.floor(entity.gameProfile.score),
                    kills: Math.floor(entity.gameProfile.kills),
                    days: Math.floor(entity.gameProfile.days)
                });
            }
        }, 1000 * 60);
        entity.resdid.push(publ);
    }
    /**
     * Entity died event
     */
    static entityDied(gameServer, entity) {
        if (Utils_1.Utils.isBuilding(entity)) {
            gameServer.worldDeleter.initEntity(entity, "building");
        }
        else {
            gameServer.worldDeleter.initEntity(entity, "living");
        }
        if (entity.type == EntityType_1.EntityType.TREASURE_CHEST)
            return;
        const _entity = (0, EntityUtils_2.getEntity)(entity.type);
        if (!_entity)
            return;
        const toDrop = [];
        for (let i = 0; i < _entity.drop.length; i++) {
            const drop = _entity.drop[i];
            const item = ItemIds_1.ItemIds[drop[0]];
            const count = drop[1];
            toDrop.push([item, count]);
        }
        ;
        WorldEvents.addBox(entity, EntityType_1.EntityType.CRATE, toDrop);
    }
}
exports.WorldEvents = WorldEvents;
