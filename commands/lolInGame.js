const { SlashCommandBuilder } = require('@discordjs/builders');
const { lolDevToken } = require('../config.json');
const { MessageEmbed } = require('discord.js');

const axios = require('axios');
const fs = require('fs');

/* Static JSON */
let championData = require('../assets/lol/constants/champion.json');
let gameModeData = require('../assets/lol/constants/gameModes.json');
let gameTypeData = require('../assets/lol/constants/gameTypes.json');
let mapsData = require('../assets/lol/constants/maps.json');
let queuesData = require('../assets/lol/constants/queues.json');
let seasonsData = require('../assets/lol/constants/seasons.json');

//console.log(championData.data['Aatrox']);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lolingame')
		.setDescription('Check LoL user in game statistics!')
    .addStringOption(option =>
      option.setName('name')
      .setDescription('Name of the summoner.')
      .setRequired(true)),
	async execute(interaction) {
		// Get user ID
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('name')}?api_key=${lolDevToken}`)
      .then(function (response) {
				// Success Handling

        // Set up Embed
				const summoner = response.data;
				axios.get(`https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summoner.id.toString()}?api_key=${lolDevToken}`)
					.then(function (response) {
						if(response.status == 200){
							/* Response Variables */
							const participants = response.data.participants;
							var enemies = [];
							var allies = [];
							var currentChampionId;
							var currentChampion;

							var map = response.data.mapId;
							var mode = response.data.gameMode;
							mode = mode.charAt(0) + mode.substring(1).toLowerCase();

							var type = response.data.gameType;

							/* Set Participants to Array */
							participants.forEach(function(table) {
								if(table.summonerName == summoner.name) {
									currentChampionId = table.championId;
								} else {
									if(table.teamId == 100) {
										allies.push(table.summonerName);
									}
									if(table.teamId == 200) {
										enemies.push(table.summonerName);
									}
								}
							});

							/* Get current champion name */
							for (const [key, value] of Object.entries(championData.data)) {
								if(value.key == currentChampionId) {
									currentChampion = key;
								}
							}

							/* Get Map */
							for (const [key, value] of Object.entries(mapsData)) {
								if(value.mapId == map) {
									map = value.mapName;
								}
							}

							/* Get Game Type */
							if(type == 'CUSTOM_GAME') {
								type = 'A Custom Game';
							} else if(type == 'TUTORIAL_GAME') {
								type = 'The Tutorial';
							} else {
								type = 'Matchmaking';
							}


							const currentGame = new MessageEmbed()
			          .setColor('#308c22')
			          .setTitle(`${summoner.name}'s Current Game`)
								.setDescription(`Currently playing ${currentChampion} in ${mode} on ${map} in ${type}`)
								.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/11.18.1/img/profileicon/${summoner.profileIconId}.png`)
								.setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChampion}_0.jpg`)
			          .addFields(
			            { name: 'Game ID', value: response.data.gameId.toString() },
									{ name: 'Enemies', value: enemies.join(', '), inline: true },
									{ name: 'Allies', value: allies.join(', '), inline: true }
			          )
			          .setTimestamp()
			          .setFooter('Pulled using the DEX Bot');
			        interaction.reply({ embeds: [currentGame], ephmeral: true });
						}
					})
					.catch(function (error) {
						// Error Handling
						console.log(error);
						interaction.reply(`Summoner ${summoner.name} is currently not in a game!`);
					});
      })
      .catch(function (error) {
        // Error Handling
        interaction.reply({content: 'Unable to find a summoner with that name.', ephmeral: true});
        console.log(error);
      });
		//
	},
};
