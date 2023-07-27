const { InteractionType } = require('discord.js');
const log = require('@helpers/logger');
const utils = require('@helpers/utils');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		log.info(
			'Interaction',
			`${interaction.user.username} in #${interaction.channel.name} triggered an interaction (/${interaction.commandName}).`,
		);

		if (!interaction.type === InteractionType.ApplicationCommand) return;

		const command = interaction.client.commands.get(interaction.commandName);

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

		utils.fireModuleEvents(interaction.client, this.name);
	},
};
