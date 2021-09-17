const { SlashCommandBuilder } = require('@discordjs/builders');
const { lolDevToken } = require('../../config.json');
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

        const summoner = response.data;

        axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id.toString()}?api_key=${lolDevToken}`)
          .then(function (response) {
            // Set up Embed

              var rankedSolo = 'N/A';
              var rankedFlex = 'N/A';
              if(response.data[0]) {
                rankedSolo = `Tier: ${response.data[0].tier} ${response.data[0].rank} [W/L: ${response.data[0].wins.toString()}/${response.data[0].losses.toString()}]`;
              }

              if(response.data[1]) {
                rankedFlex = `Tier: ${response.data[1].tier} ${response.data[1].rank} [W/L: ${response.data[1].wins.toString()}/${response.data[1].losses.toString()}]`;
              }

              const summonerProfile = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(summoner.name)
                .addFields(
                  { name: 'Summoner Level', value: summoner.summonerLevel.toString() },
                  { name: 'Ranked Solo', value: rankedSolo },
                  { name: 'Ranked Flex', value: rankedFlex }
                )
                .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/11.18.1/img/profileicon/${summoner.profileIconId}.png`)
                .setTimestamp()
                .setFooter('Pulled using the DEX Bot');
              interaction.reply({ embeds: [summonerProfile] });
          })
          .catch(function (error) {
            interaction.reply({ content: 'Unable to pull summoner data.', ephemeral: true });
            console.log(error);
          });
      })
      .catch(function (error) {
        // Error Handling
        interaction.reply({ content: 'Unable to find a summoner with that name.', ephemeral: true });
        console.log(error);
      });
		//
	},
};
