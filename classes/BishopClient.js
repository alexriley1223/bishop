const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, color, name } = require('@config/bot.json');
const { useDatabase } = require('@config/database.json');
const BishopDatabase = require('@classes/BishopDatabase.js');
const bootCheck = require('@handlers/bootChecks.js');
const logger = require('@helpers/logger');
const utils = require('@helpers/utils');
const fs = require('fs');

module.exports = class BishopClient extends Client {
    constructor(...opt) {
        super({
            opt,
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });

        this.bishop = {};
        this.bishop.logger = logger;
        this.bishop.modules = new Collection();
        this.bishop.events = {};
        this.bishop.jobs = [];
        this.bishop.migrations = [];
        this.bishop.commands = new Collection();
        this.bishop.jsonCommands = new Collection();
        this.bishop.color = color;
        this.bishop.name = name;

        if(useDatabase) {
            this.bishop.db = new BishopDatabase();
            this.bishop.db.connect(this);
        }
    }

    async boot() {
        await bootCheck();
        
        let handlers = ["moduleHandler", "eventHandler", "commandHandler", "jobHandler"];

        if(useDatabase) {
            handlers.push("migrationHandler");
        }
        handlers.forEach((handler) => {
            let handlerFile = require(`@handlers/${handler}`);
            (async () => {
                await handlerFile(this);
            })();
        });

        await this.login();
    }

    generateModuleLoadOrder(modules) {
        const loadOrderDir = `${__dirname}/../load_order.txt`;
        let loadOrderArr = [];

        if (fs.existsSync(loadOrderDir)) {
            const loadOrder = fs.readFileSync(loadOrderDir, { encoding: 'utf8', flag: 'r' });
            loadOrderArr = loadOrder.split('\n');
    
            utils.removeExtraLine(loadOrderArr);
    
            if (!utils.equals(loadOrderArr, modules)) {
                throw Error('Load order is not in sync with modules directory.');
            }
            else {
                logger.success(
                    'Boot',
                    'Load order is in sync with modules directory, proceeding to module activation.',
                );
            }

            return loadOrderArr;
        } else {
            fs.writeFileSync(loadOrderDir, '', (err) => {
                if (err) {
                    throw Error('Failed to create load order file.');
                }
                else {
                    throw '✅ Created load order file successfully. Reloading application.';
                }
            });
    
            fs.appendFileSync(
                loadOrderDir,
                modules.join('\n'),
                (err) => {
                    if (err) {
                        throw Error('Failed to write to load order file.');
                    }
                },
            );

            /* Load newly written file */
            const loadOrder = fs.readFileSync(loadOrderDir, { encoding: 'utf8', flag: 'r' });
            loadOrderArr = loadOrder.split('\n');
            utils.removeExtraLine(loadOrderArr);

            return loadOrderArr;
        }
    }

    async login() {
        try {
            super.login(token);
        }
        catch (e) {
            throw Error('❌ Failed to login Bot. Please try again.');
        }
    }
}