const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the currently playing song.'),
 	async execute(interaction) {
	  const connection = getVoiceConnection(interaction.channel.guild.id);

	  if(connection) {
      connection._state.subscription.player.stop();
      await interaction.reply({ content: `The current song has been skipped!` });
	  } else {
	    await interaction.reply({ content: `Bot is not currently playing any audio!`, ephemeral: true });
	  }
	},
};
