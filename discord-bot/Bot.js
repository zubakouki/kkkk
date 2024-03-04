"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitsManager = void 0;


const ItemIds_1 = require("../enums/ItemIds");
const kits = require("../discord-bot/AppData/kits.json");
const ConsoleManager_1 = require("../models/ConsoleManager");
const Config = require("./AppData/config.json");


class KitsManager {
    static GameServer
    static Cooldown = {}


    constructor(GameServer) {
      KitsManager.GameServer = GameServer;
    }

    static INTERAC(Intercation, GameServer, sourcePlayer) {
        return Kit_Intercation(Intercation, GameServer, sourcePlayer);
    }

    static Check_CoolDown(Interaction) {
        let Member_ID = Interaction.member.id;

        if (Config.Owners.includes(Member_ID)) {
            return true;
        }
    
        if (this.Cooldown.hasOwnProperty(Member_ID)) {
            let lastUsed = this.Cooldown[Member_ID].Time;
            if(performance.now() - lastUsed >= Config.Delay_Time){
                this.Cooldown[Member_ID].Time = performance.now()
                return true;
            }
            return false;
        } else {
            this.Cooldown[Member_ID] = {}
            this.Cooldown[Member_ID].Time = performance.now()
            return true;
        }
    }

    static Check_Admin(Interaction) {
        let Roles = Interaction.member.roles.cache.map(role => role.id);
        let Member_ID = Interaction.member.id;
        if (Config.Admins_Roles.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }

    static Check_Roles(Interaction) {
        let Roles = Interaction.member.roles.cache.map(role => role.id);
        let Member_ID = Interaction.member.id;
        if (Config.Booster.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }
    static Check_Roles2(Interaction) {
        let Roles = Interaction.member.roles.cache.map(role => role.id);
        let Member_ID = Interaction.member.id;
        if (Config.Vip.some(Role => Roles.includes(Role)) || Config.Owners.includes(Member_ID)) {
            return true;
        } else {
            return false;
        }
    }

    static VERIFY(Intercation, KIT_TYPE) {
        switch (KIT_TYPE) {
            case 'events':
                if(this.Check_Admin(Intercation, 'Admin_Roles')){
                    return {Verify_Result: true}
                } else {
                    return {Verify_Result: false, Reason: 'You Dont Have Enough Permissions'}
                }

            case 'booster':
                if(this.Check_Roles(Intercation)){
                    if(this.Check_CoolDown(Intercation)){
                        return {Verify_Result: true}
                    } else {
                        let Required_Time = Math.round((Config.Delay_Time - (performance.now() - this.Cooldown[Intercation.member.id].Time)) / 60000);
                        return {Verify_Result: false, Reason: `${Required_Time} Minutes Remaining before you can use the bot`}
                    }
                }
      
            case 'vip':
                if(this.Check_Roles2(Intercation)){
                    if(this.Check_CoolDown(Intercation)){
                        return {Verify_Result: true}
                    } else {
                        let Required_Time = Math.round((Config.Delay_Time - (performance.now() - this.Cooldown[Intercation.member.id].Time)) / 60000);
                        return {Verify_Result: false, Reason: `${Required_Time} Minutes Remaining before you can use the bot`}
                    }
                }
    
            case 'kitmanager':
                if(this.Check_Admin(Intercation, 'Admin_Roles')){
                    return {Verify_Result: true}
                } else {
                    return {Verify_Result: false, Reason: 'You Dont Have Enough Permissions'}
                }
        }
    }
  
    static BOOSTER(sourcePlayer) {
        kits.booster.forEach(({ name, amount }) =>
            sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount)
        );
    }
  
    static VIP(sourcePlayer) {
        kits.VIP.forEach(({ name, amount }) =>
            sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount)
        );
    }
  
    static EVENT(sourcePlayer) {
        kits.event.forEach(({ name, amount }) =>
            sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount)
        );
    }

    static KITSMANAGER(sourcePlayer) {
        kits.KitManager.forEach(({ name, amount }) =>
            sourcePlayer.inventory.addItem(Number(ItemIds_1.ItemIds[name]), amount)
        );
      }
  }

  
function Kit_Intercation(Intercation, GameServer) {
    let KIT_TYPE;
    let PLAYER_ID;


    for (let i = 0; i < Intercation.options._hoistedOptions.length; i++) {
        const option = Intercation.options._hoistedOptions[i];
        if (option.name === 'kit-type') {
            KIT_TYPE = option.value;
        }
        if (option.name === 'id') {
            PLAYER_ID = option.value;
        }
    }



    const Player = ConsoleManager_1.findPlayerByIdOrName(Number(PLAYER_ID), GameServer)

  
    if (!Player) {
        return 'No Player Found';
    };
  
    switch (KIT_TYPE) {
        case 'events':
           if(KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']){
                KitsManager.EVENT(Player)
                return 'Event Kit Added SuccessFully';
           } else {
                return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
           }

        case 'booster':
            if(KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']){
                KitsManager.BOOSTER(Player)
                return 'Booster Kit Added SuccessFully';
            } else {
                return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
           }

        case 'vip':
            if(KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']){
                KitsManager.VIP(Player)
                return 'VIP Kit Added SuccessFully';
            } else {
                return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
           }

        case 'kitmanager':
            if(KitsManager.VERIFY(Intercation, KIT_TYPE)['Verify_Result']){
                KitsManager.KITSMANAGER(Player)
                return 'Manager Kit Added SuccessFully';
            } else {
                return KitsManager.VERIFY(Intercation, KIT_TYPE)['Reason']
           }
    }
    
}

exports.KitsManager = KitsManager;