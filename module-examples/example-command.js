const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = new BishopCommand({
	enabled: true,
	data: new SlashCommandBuilder().setName('command').setDescription('Example command'),
	execute: async function(interaction) {
	
	},
});
