const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause bot if currently playing audio.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (queue.node.isPaused()) {
			return interaction.reply({ content: 'Bot is already paused!', ephemeral: true });
		}
		queue.node.pause();

		return await interaction.reply({ content: 'Bot has been paused!' });
	},
};
