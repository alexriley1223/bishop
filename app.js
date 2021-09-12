const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Initiate client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Initial commands from ./commands folder
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

/* Cycle ./commands folder and add each command to collection */
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

/* Client is initialized and ready */
client.once('ready', () => {
	console.log('Ready!');
  client.user.setActivity('These Hands', { type: 'COMPETING' });
});

/* On user interaction with slash commands */
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

	if (!command) return;

  // Valid Command - try to execute
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
