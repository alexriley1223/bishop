// Register aliases
require('module-alias/register');

const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('@config/bot.json');
const modules = require('@config/modules.json');

const commandPath = './commands';
const commands = [];

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

// Recursively pull all commands from commandPath folder and subfolders; check if module is enabled
const commandFiles = getModulatedCommands(commandPath);

// Pull JSON data from each command file to register with Discord
for (const file of commandFiles) {
	const command = require(`./${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
    console.log('Started registering application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
