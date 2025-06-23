const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('@config/bot.json');

module.exports = async (client) => {
	const rest = new REST().setToken(token);
	try {
		client.bishop.logger.info(
			'BOOT',
			`Started refreshing ${client.bishop.jsonCommands.size} application (/) commands.`,
		);

		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: client.bishop.jsonCommands,
		});

		client.bishop.logger.info(
			'BOOT',
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	}
	catch (error) {
    throw Error(`Failed to register application commands. Please try again. ${error}`);
	}
};
