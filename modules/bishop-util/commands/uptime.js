const { SlashCommandBuilder } = require('@discordjs/builders');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder().setName('uptime').setDescription('Show current bot uptime'),
	execute(interaction) {
		interaction.reply({
			content: `Bot has been up for ${prettyMilliseconds(interaction.client.uptime)}!`,
			ephemeral: true,
		});
	},
};
