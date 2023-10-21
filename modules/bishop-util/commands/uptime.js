const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const prettyMilliseconds = require('pretty-ms');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('uptime').setDescription('Show current bot uptime'),
	execute: async function(interaction) {
		interaction.reply({
			content: `${interaction.client.bishop.name} has been up for ${prettyMilliseconds(
				interaction.client.uptime,
			)}!`,
			ephemeral: true,
		});
	},
});
