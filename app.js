const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Initiate client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Initiate events from ./events folder
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Initiate commands from ./commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

/* Cycle ./commands folder and add each command to collection */
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
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
