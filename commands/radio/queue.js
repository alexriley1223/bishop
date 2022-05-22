const { MessageEmbed } = require('discord.js');
const { color, name } = require('@config/bot.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the current queue.'),
 	async execute(interaction) {

    if(global.songQueue && global.songQueue.length > 0) {
      var counter = 1;
      const queue = new MessageEmbed()
        .setColor(color)
        .setTitle(`${name} Music Queue`)
        .setDescription(`Current queue of the ${name} Bot`)
        .setTimestamp()
        .setFooter(`Pulled using the ${name} Bot`);

      global.songQueue.forEach(function(song){
        queue.addField(`${counter}. `, song.title);
        counter++;
      });

      await interaction.reply({ embeds: [queue], ephemeral: true });
    } else {
      await interaction.reply({ content: 'No songs currently in the queue.', ephemeral: true });
    }

	},
};
