const { InteractionType } = require('discord.js');
const log = require('@helpers/logger');
const BishopEvent = require('@classes/BishopEvent');

module.exports = new BishopEvent({
	name: 'interactionCreate',
	once: false,
	init: (...opt) => {
		const chatCommandInteraction = opt[0];

		log.info(
			'Interaction',
			`${chatCommandInteraction.user.username} in #${chatCommandInteraction.channel.name} triggered an interaction (${(chatCommandInteraction.commandName) ? '/' + chatCommandInteraction.commandName : 'Component Click'}).`,
		);

		if (chatCommandInteraction.type === InteractionType.ApplicationCommand) {
			const command = chatCommandInteraction.client.bishop.commands.get(
				chatCommandInteraction.commandName,
			);

			try {
				command.execute(chatCommandInteraction);
			}
			catch (error) {
				log.error('evt', error);
				chatCommandInteraction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
	},
});
