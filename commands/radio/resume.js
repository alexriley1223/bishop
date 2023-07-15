const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume playing bot if currently paused.'),
	async execute(interaction) {

		const queue = useQueue(interaction.guild.id);
		if (queue.node.isPlaying()) {
			return interaction.reply({ content: `Bot is already playing!`, ephemeral: true });
		}
		queue.node.resume();
	
		return await interaction.reply({ content: `Bot playback has been resumed!` });
	},
};
