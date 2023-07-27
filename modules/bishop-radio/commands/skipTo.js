const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('skipto')
		.setDescription('Skip to the given song, removing others in the way')
		.addIntegerOption((option) =>
			option
				.setName('index')
				.setDescription('Track index to skip to. Use /queue to check.')
				.setRequired(true),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue?.size < 1) {
			return interaction.reply({ content: 'The queue has no more tracks.', ephemeral: true });
		}

		const index = interaction.options.getInteger('index', true) - 1;

		if (index > queue.size || index < 0) {
			return interaction.reply({ content: 'Not a valid queue index.', ephemeral: true });
		}

		queue.node.skipTo(index);

		return interaction.reply({ content: `Skipped to track ${index + 1} in the queue.` });
	},
};
