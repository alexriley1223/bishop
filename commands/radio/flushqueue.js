const { SlashCommandBuilder } = require('@discordjs/builders');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flushqueue')
		.setDescription('Clear the queue of all songs.'),
 	async execute(interaction) {
    global.songQueue = [];
    await interaction.reply({ content: `The queue has been reset!` });
	},
};
