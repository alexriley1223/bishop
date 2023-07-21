// Register aliases
require('module-alias/register');

const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents, ActivityType } = require('discord.js');
const { token } = require('@config/bot.json');
const { Player } = require('discord-player');
const modules = require('@config/modules.json');

const commandPath = './commands';

// Initiate client
const client = new Client({
	intents: ['Guilds', 'GuildVoiceStates']
 });


// Register global radio
if(modules.radio) {
	const player = new Player(client);
	player.extractors.loadDefault();

	// Small events here for now
	player.events.on('playerStart', (queue, track) => {
		client.user.setPresence({
			activities: [{ name: `${track.title} by ${track.author}`, type: ActivityType.Listening }]
		});
	});
	player.events.on('emptyQueue', (queue, track) => {
		setTimeout(() => {
			client.user.setPresence({
				activities: [{ name: `These Hands`, type: ActivityType.Competing }]
			});
		}, 2000);
	});
	player.events.on('disconnect', (queue, track) => {
		setTimeout(() => {
			client.user.setPresence({
				activities: [{ name: `These Hands`, type: ActivityType.Competing }]
			});
		}, 2000);
	});
}

// Initiate events from ./events folder
var eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Add points events if points module is enabled (REFACTOR WHEN MORE EVENTS EXIST)
if(modules.points) {
	console.log('Registering Points Events');
	pointsEvents = fs.readdirSync('./events/points').filter(file => file.endsWith('.js'));
	for(var i = 0; i < pointsEvents.length; i++) {
		pointsEvents[i] = '/points/' + pointsEvents[i];
	}
	eventFiles = eventFiles.concat(pointsEvents);
}

// Initiate commands from ./commands folder
client.commands = new Collection();

/*
	* Recursively pulls all files from directory
	* @param {string} dirPath Directory of parent folder
	* @param {object} arrayOfCommands Return object for list of file paths
 */
const getAllCommands = function(dirPath, arrayOfCommands) {
	let commandFiles = fs.readdirSync(dirPath);

	arrayOfCommands = arrayOfCommands || []

	commandFiles.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfCommands = getAllCommands(dirPath + "/" + file, arrayOfCommands);
		} else {
			arrayOfCommands.push(path.join(dirPath, "/", file));
		}
	});

	return arrayOfCommands;
}

/*
	* Recursively pulls all directories and checks if enabled in modules config
	* @param {string} dirPath Directory of parent folder
	* @param {object} arrayOfCommands Return object for list of file paths
 */
const getModulatedCommands = function(dirPath, arrayOfCommands) {
	let commandFiles = fs.readdirSync(dirPath);

	arrayOfCommands = arrayOfCommands || []

	Object.keys(modules).forEach(function(key) {
		if(modules[key]) {
			console.log('Enabling ' + key);
			var commandIndex = commandFiles.indexOf(key);

			if (fs.statSync(dirPath + "/" + commandFiles[commandIndex]).isDirectory()) {
				arrayOfCommands = getAllCommands(dirPath + "/" + commandFiles[commandIndex], arrayOfCommands);
			} else {
				arrayOfCommands.push(path.join(dirPath, "/", commandFiles[commandIndex]));
			}
		} else {
			console.log('Disabling ' + key);
		}
	});

	return arrayOfCommands;
}

// Recursively pull all commands from commandPath folder and subfolders
const commandFiles = getModulatedCommands(commandPath);

/* Cycle enabled commands and add each command to collection */
for (const file of commandFiles) {
	const command = require(`./${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

/* Cycle enabled events and execute on event call */
for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login bot
client.login(token);
