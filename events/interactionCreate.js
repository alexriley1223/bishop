const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(
			`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`,
		);

		if (!interaction.type === InteractionType.ApplicationCommand) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		// Valid Command - try to execute
		try {
			command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
