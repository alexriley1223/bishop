const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { musicChannelId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop audio bot if currently playing audio.'),
 	async execute(interaction) {
    /* Check if user has valid role */
    if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {

			if(interaction.channelId == musicChannelId) {
				const connection = getVoiceConnection(interaction.channel.guild.id);
				
	      if(connection) {
	        connection.destroy();
	        await interaction.reply({ content: `Bot has been stopped!` });
	      } else {
	        await interaction.reply({ content: `Bot is not currently playing any audio!`, ephemeral: true });
	      }
			} else {
				await interaction.reply({ content: 'You must be in the music channel to run this command.', ephemeral: true });
			}

    } else {
      interaction.reply({ content: 'You do not have permissions to run this command.', ephemeral: true });
    }
	},
};
