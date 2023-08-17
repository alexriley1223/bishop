const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('movetrack')
		.setDescription('Move a track in the queue')
		.addIntegerOption((option) =>
			option
				.setName('from')
				.setDescription('Track index to move. Use /queue to check.')
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName('to').setDescription('Track index to move to.').setRequired(true),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue?.size < 3) {
			return interaction.reply({
				content: 'The queue needs at least 3 tracks to use this command.',
				ephemeral: true,
			});
		}

		// Remove one since we're adding +1 in queue
		const from = interaction.options.getInteger('from', true) - 1;
		const to = interaction.options.getInteger('to', true) - 1;

		if (from < 0 || from >= queue.size) {
			return interaction.reply({ content: 'Provided \'from\' is not valid.', ephemeral: true });
		}
		if (to < 0 || to >= queue.size) {
			return interaction.reply({ content: 'Provided \'to\' is not valid.', ephemeral: true });
		}
		if (from === to) {
			return interaction.reply({
				content: 'The track is already in this position.',
				ephemeral: true,
			});
		}

		queue.node.move(from, to);

		return interaction.reply({
			content: `Track ${from + 1} moved to position ${to + 1} in the queue.`,
		});
	},
};
