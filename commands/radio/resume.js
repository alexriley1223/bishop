const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection  } = require('@discordjs/voice');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume playing bot if currently paused.'),
 	async execute(interaction) {
		const connection = getVoiceConnection(interaction.channel.guild.id);

    if(connection) {
			connection._state.subscription.player.unpause();
      await interaction.reply({ content: `Bot has been unpaused!` });
    } else {
      await interaction.reply({ content: `Bot is not currently playing any audio!`, ephemeral: true });
    }
	},
};
