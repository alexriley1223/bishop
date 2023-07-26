/* Inital Boot Check */
const boot = require('./helpers/boot');
boot();

require('module-alias/register');
const fs = require('fs');
const { Client, Collection } = require('discord.js');
const { clientId, guildId, token } = require('@config/bot.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const log = require('./helpers/logger');
const utils = require('./helpers/utils');

const commandArr = [];

// Initiate client
const client = new Client({
	intents: ['Guilds', 'GuildVoiceStates'],
});

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
						client.commands = new Collection();

						for (const file of commands) {
							const command = require(`./${file}`);
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

						log.info('Boot', `✅ ${module.name} commands loaded.`);
					}
				}

				/* Register module events */
				if (fs.existsSync(`./modules/${m.name}/events`)) {
					const events = utils.getAllFiles(`./modules/${m.name}/events`);
					if (events.length > 0) {
						log.info(
							'Boot',
							`🔄 Starting to load ${module.name} events. ${events.length} discovered.`,
						);

						for (const file of events) {
							const event = require(`./${file}`);

							if (event.once) {
								client.once(event.name, (...args) => event.execute(...args));
							}
							else {
								client.on(event.name, (...args) => event.execute(...args));
							}
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
							require(`./${file}`);
						}

						log.info('Boot', `✅ ${module.name} jobs loaded.`);
					}
				}
			}
		}
	}
});

/* Load Bishop Events */
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

// Deploy Commands
const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commandArr.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commandArr,
		});

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

/* Login Bot */
try {
	client.login(token);
}
catch (e) {
	throw Error('❌ Failed to login Bot. Please try again.');
}
