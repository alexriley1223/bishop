const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Show current bot uptime'),
 	execute(interaction) {
    /* Check if user has valid role */
    if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      interaction.reply({content: `Bot has been up for ${prettyMilliseconds(interaction.client.uptime)}!`, ephemeral: true});
    } else {
      interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
    }
	},
};
