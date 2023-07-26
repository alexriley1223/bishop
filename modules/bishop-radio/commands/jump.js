const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Jump to a track without removing others in the way')
		.addIntegerOption((option) =>
			option.setName('index').setDescription('Track index to jump to.').setRequired(true),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue?.size < 1) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		const index = interaction.options.getInteger('index', true) - 1; // Remove one since we're adding +1 in queue

		if (index > queue?.size || index < 0) {
			return interaction.reply({ content: 'Not a valid queue index.', ephemeral: true });
		}

		queue.node.jump(index);

		return interaction.reply({ content: `Jumped to track ${index + 1} in the queue.` });
	},
};
