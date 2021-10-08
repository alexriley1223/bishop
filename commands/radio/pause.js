const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause bot if currently playing audio.'),
 	async execute(interaction) {
    /* Check if user has valid role */
		if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      const connection = getVoiceConnection(interaction.channel.guild.id);

      if(connection) {
				connection._state.subscription.player.pause();
        await interaction.reply({ content: `Bot has been paused!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `Bot is not currently playing any audio!`, ephemeral: true });
      }

    } else {
      interaction.reply({ content: 'You do not have permissions to run this command.', ephemeral: true });
    }
	},
};