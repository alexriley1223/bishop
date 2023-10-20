const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const gitVersion = require('git-tag-version');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder().setName('version').setDescription('Show current bot version'),
	execute: async function(interaction) {
		interaction.reply({
			content: `${interaction.client.bishop.name} is currently running on v${gitVersion()}!`,
			ephemeral: true,
		});
	},
});
