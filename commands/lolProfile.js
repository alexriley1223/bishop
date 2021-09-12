const { SlashCommandBuilder } = require('@discordjs/builders');
const { lolDevToken } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lolprofile')
		.setDescription('Check LoL user stats!')
    .addStringOption(option =>
      option.setName('name')
      .setDescription('Name of the summoner.')
      .setRequired(true)),
	async execute(interaction) {
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('name')}?api_key=${lolDevToken}`)
      .then(function (response) {
        // Success Handling

        // Set up Embed
        const summonerProfile = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(response.data.name)
          .addFields(
            { name: 'Summoner Level', value: response.data.summonerLevel.toString() }
          )
					.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/11.18.1/img/profileicon/${summoner.profileIconId}.png`)
          .setTimestamp()
          .setFooter('Pulled using the DEX Bot');
        interaction.reply({embeds: [summonerProfile], ephmeral: false});
      })
      .catch(function (error) {
        // Error Handling
        console.log(error);
      });
		//
	},
};
