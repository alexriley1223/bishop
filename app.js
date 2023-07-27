require('module-alias/register');

/* Inital Boot Check */
const boot = require('@helpers/boot');
boot();

const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { clientId, guildId, token } = require('@config/bot.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const log = require('@helpers/logger');
const utils = require('@helpers/utils');

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
					log.error('Boot', `❌ Failed to load module ${module.name}.`);
				}
				log.info(
					'Boot',
					`✅ ${module.name} (${module.version}) initialization complete. Running modulations.`,
				);

				/* Register module commands */
				if (fs.existsSync(`./modules/${m.name}/commands`)) {
					const commands = utils.getAllFiles(`./modules/${m.name}/commands`);
					if (commands.length > 0) {
						log.info(
							'Boot',
							`🔄 Starting to load ${module.name} commands. ${commands.length} discovered.`,
						);

						for (const file of commands) {
							const command = require(`./${file}`);

							if ('enabled' in command && command.enabled) {
								if ('data' in command && 'execute' in command) {
									client.commands.set(command.data.name, command);
									commandArr.push(command.data.toJSON());
								}
								else {
									log.warn(
										'Boot',
										`The command at ${file} is missing a required "data" or "execute" property.`,
									);
								}
							}
						}

						log.info('Boot', `✅ ${module.name} commands loaded.`);
					}
				}

				/* Register module events to client events object */
				if (fs.existsSync(`./modules/${m.name}/events`)) {
					const events = utils.getAllFiles(`./modules/${m.name}/events`);
					if (events.length > 0) {
						log.info(
							'Boot',
							`🔄 Starting to load ${module.name} events. ${events.length} discovered.`,
						);

						for (const file of events) {
							const singleName = file.split('/').slice(-1).join();
							if (!fs.existsSync(`./events/${singleName}`)) {
								log.error(
									'Boot',
									`❌ Failed to load event ${singleName} for ${module.name}. Please ensure the template event exists in ~/events.`,
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
						}

						log.info('Boot', `✅ ${module.name} events loaded.`);
					}
				}

				/* Run any DB if needed */

				/* Register any Jobs */
				if (fs.existsSync(`./modules/${m.name}/jobs`)) {
					const jobs = utils.getAllFiles(`./modules/${m.name}/jobs`);
					if (jobs.length > 0) {
						log.info('Boot', `🔄 Starting to load ${module.name} jobs. ${jobs.length} discovered.`);

						for (const file of jobs) {
							const job = require(`./${file}`);
							if (job.enabled) {
								job.executeJob();
							}
						}

						log.info('Boot', `✅ ${module.name} jobs loaded.`);
					}
				}
			}
		}
	}
});

/* Load Bishop Events */
/* TODO: move this to a module like bishop-core or something? */
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
