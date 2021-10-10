const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const gitVersion = require('git-tag-version');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Show current bot version'),
 	execute(interaction) {
    /* Check if user has valid role */
    if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      interaction.reply({content: `Bot is currently running on v${gitVersion()}!`, ephemeral: true});
    } else {
      interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
    }
	},
};
