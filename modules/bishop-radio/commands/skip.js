const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the currently playing song.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.size < 1 && queue.repeatMode !== 3) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		queue.node.skip();

		return interaction.reply({ content: 'Current track has been skipped!' });
	},
};
