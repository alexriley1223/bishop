const { SlashCommandBuilder } = require('@discordjs/builders');
const gitVersion = require('git-tag-version');
const { name } = require('@config/bot.json');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder().setName('version').setDescription('Show current bot version'),
	execute(interaction) {
		interaction.reply({
			content: `${name} is currently running on v${gitVersion()}!`,
			ephemeral: true,
		});
	},
};
