const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Adjust the volume of current playback.')
		.addIntegerOption((option) =>
			option
				.setName('volume')
				.setDescription('The volume to set the music to.')
				.setMinValue(1)
				.setMaxValue(200),
		),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		const newVolume = interaction.options.getInteger('volume');

		if (!newVolume) {
			return await interaction.reply({
				content: `Use /volume <1-200> to adjust the volume. Current volume is ${queue.node.volume}%!`,
				ephemeral: true,
			});
		}

		queue.node.setVolume(newVolume);

		return await interaction.reply({
			content: `Bot playback volume has been adjusted to ${newVolume}%!`,
		});
	},
};
