require('module-alias/register');

/* Inital Boot Check */
const boot = require('@helpers/boot');
boot();

const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { clientId, guildId, token } = require('@config/bot.json');

const databaseConfiguration = require('@config/database.json');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const log = require('@helpers/logger');
const utils = require('@helpers/utils');
const { Sequelize, DataTypes } = require('sequelize');

const commandArr = [];

/* Initiate client */
/* TODO: ALlow modules to require Gateway Intents checks */
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});

client.commands = new Collection();
client.bishop = {};

/* Setup Database */
let sequelize;
if(databaseConfiguration.useDatabase) {
	sequelize = new Sequelize(databaseConfiguration.database, databaseConfiguration.username, databaseConfiguration.password, {
		host: databaseConfiguration.host,
		dialect: databaseConfiguration.driver,
		logging: databaseConfiguration.logging,
		storage: `./database/${databaseConfiguration.name}.sqlite`
	});
	
	try {
		log.info('Boot', `🔄 Checking Database configuration.`);
		sequelize.authenticate();
		log.info('Boot', `✅ Database is setup and configured correctly.`);
	  } catch (error) {
		log.error('Boot', `❌ █ Failed to connect to database. Please check your configuration.`);
	}
}

/* Load Modules */
const modules = fs.readdirSync('./modules', { withFileTypes: true });
modules.forEach((m) => {
	if (m.isDirectory()) {
		if (fs.existsSync(`./modules/${m.name}/init.js`)) {
			const module = require(`./modules/${m.name}/init`)(client);

			if (module.enabled) {
				/* Run arbitrary init function for module specific dependencies or boot */
				log.info('Boot', `🔄 Starting to load module ${module.name} (${module.version}).`);
				try {
					module.init();
				}
				catch (e) {
					log.error('Boot', `❌ █ Failed to load module ${module.name}.`);
				}
				log.info(
					'Boot',
					`✅ █ ${module.name} (${module.version}) initialization complete. Running modulations.`,
				);

				/* Register module commands */
				if (fs.existsSync(`./modules/${m.name}/commands`)) {
					const commands = utils.getAllFiles(`./modules/${m.name}/commands`);
					if (commands.length > 0) {
						log.info(
							'Boot',
							`🔄 █ Starting to load ${module.name} commands. ${commands.length} discovered.`,
						);

						let commandCount = 0;

						for (const file of commands) {
							const command = require(`./${file}`);

							if ('enabled' in command && command.enabled) {
								if ('data' in command && 'execute' in command) {
									client.commands.set(command.data.name, command);
									commandArr.push(command.data.toJSON());
									commandCount++;
								}
								else {
									log.warn(
										'Boot',
										`⚠️  ██ The command at ${file} is missing a required "data" or "execute" property.`,
									);
								}
							}
						}

						log.info('Boot', `✅ █ ${commandCount} ${module.name} commands loaded.`);
					}
				}

				/* Register module events to client events object */
				if (fs.existsSync(`./modules/${m.name}/events`)) {
					const events = utils.getAllFiles(`./modules/${m.name}/events`);
					if (events.length > 0) {
						log.info(
							'Boot',
							`🔄 █ Starting to load ${module.name} events. ${events.length} discovered.`,
						);
						
						let eventCount = 0;

						for (const file of events) {
							const singleName = file.split('/').slice(-1).join();
							if (!fs.existsSync(`./events/${singleName}`)) {
								log.error(
									'Boot',
									`❌ █ Failed to load event ${singleName} for ${module.name}. Please ensure the template event exists in ~/events.`,
								);
							}

							const singleNameNoExt = singleName.replace('.js', '');

							if (!client.bishop.events) {
								client.bishop.events = {};
							}

							if (!client.bishop.events[singleNameNoExt]) {
								client.bishop.events[singleNameNoExt] = [];
							}

							client.bishop.events[singleNameNoExt].push(file);

							eventCount++;
						}

						log.info('Boot', `✅ █ ${eventCount} ${module.name} events loaded.`);
					}
				}

				/* Run any DB definitions/seeding if needed */
				if (fs.existsSync(`./modules/${m.name}/database`) && databaseConfiguration.useDatabase) {
					const databases = utils.getAllFiles(`./modules/${m.name}/database`);

					if (databases.length > 0) {
						log.info('Boot', `🔄 █ Starting to load ${module.name} database. ${databases.length} discovered.`);

						let databaseCount = 0;

						for (const file of databases) {
							const database = require(`./${file}`)(sequelize, DataTypes);
							if (database.enabled) {
								database.define();
								databaseCount++;
							}
						}

						log.info('Boot', `✅ █ ${databaseCount} ${module.name} databases defined.`);
					}
				}

				/* Register any Jobs */
				if (fs.existsSync(`./modules/${m.name}/jobs`)) {
					const jobs = utils.getAllFiles(`./modules/${m.name}/jobs`);
					if (jobs.length > 0) {
						log.info('Boot', `🔄 █ Starting to load ${module.name} jobs. ${jobs.length} discovered.`);

						let jobCount = 0;

						for (const file of jobs) {
							const job = require(`./${file}`);
							if (job.enabled) {
								job.executeJob();
								jobCount++;
							}
						}

						log.info('Boot', `✅ █ ${jobCount} ${module.name} jobs loaded.`);
					}
				}

				log.info('Boot', `😋 Done loading module ${module.name} (${module.version}).`);
			}
		}
	}
});

/* Load Bishop Base Events */
const bishopEvents = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const file of bishopEvents) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

/* Deploy Commands */
const rest = new REST().setToken(token);
(async () => {
	try {
		log.info('BOOT', `Started refreshing ${commandArr.length} application (/) commands.`);

		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandArr,
		});

		log.info('BOOT', `Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		throw Error('❌ Failed to register application commands. Please try again.');
	}
})();

/* Login Bot */
try {
	client.login(token);
}
catch (e) {
	throw Error('❌ Failed to login Bot. Please try again.');
}
