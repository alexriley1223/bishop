const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const commandPath = './commands';

// Initiate client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Initiate events from ./events folder
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

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

// Recursively pull all commands from commandPath folder and subfolders
const commandFiles = getAllCommands(commandPath);

/* Cycle ./commands folder and add each command to collection */
for (const file of commandFiles) {
	const command = require(`./${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

/* Cycle ./events folder and execute on event call */
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
