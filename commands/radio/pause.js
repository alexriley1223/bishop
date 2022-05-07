const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause bot if currently playing audio.'),
 	async execute(interaction) {
	  const connection = getVoiceConnection(interaction.channel.guild.id);

	  if(connection) {
			connection._state.subscription.player.pause();
	    await interaction.reply({ content: `Bot has been paused!` });
	  } else {
	    await interaction.reply({ content: `Bot is not currently playing any audio!`, ephemeral: true });
	  }
	},
};
