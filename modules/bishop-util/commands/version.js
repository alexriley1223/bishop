const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { version } = require('@root/package.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('version').setDescription('Show current bot version'),
	execute: async function(interaction) {
		interaction.reply({
			content: `${interaction.client.bishop.name} is currently running on v${version}!`,
			ephemeral: true,
		});
	},
});
