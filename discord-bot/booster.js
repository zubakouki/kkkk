"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBot = void 0;

const { Client, GatewayIntentBits, Interaction, discordSort } = require("discord.js");
const KitsManager_1 = require("./Bot");
const { Loggers } = require('../logs/Logger');
const Commands = require("./AppData/commands.json");
const Config = require("./AppData/config.json");

class DiscordBot {
    static GameServer;
    static client;

    constructor(GameServer) {
        DiscordBot.GameServer = GameServer;
        DiscordBot.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });
        DiscordBot.start()
    }

    static send(serverId, channelId, message) {
        const guild = DiscordBot.client.guilds.cache.get(serverId);
        const channel = guild.channels.cache.get(channelId);
        
        if (!guild) {
          return;
        }
        if (!channel) {
          return;
        }

        channel.send(message);
    }

    static start() {
        DiscordBot.client.once('ready', async () => {
            try {
                const promises = Config.Guilds.map(async (guildId) => {
                    const server = DiscordBot.client.guilds.resolve(guildId);
                    if (!server) {
                        console.log(`Server with ID ${guildId} not found.`);
                        return;
                    }

                    await server.commands.set(Commands).then(() => {
                        Loggers.app.info('Discord Bot Setup');
                    });
                });
    
                await Promise.all(promises);

            } catch (error) {
                console.log(error)
            }
        });


        DiscordBot.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            switch(interaction.commandName){
                case 'kit':
                    interaction.reply(KitsManager_1.KitsManager.INTERAC(interaction, DiscordBot.GameServer))
                    break;
            }
        })

        DiscordBot.client.login(Config.Token);
    }
}

exports.DiscordBot = DiscordBot;