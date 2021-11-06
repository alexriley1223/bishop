const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color } = require('@config/bot.json');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('List points leaderboard'),
 	execute(interaction) {
		/* Generate embed message for leaderboard */
		const currentGame = new MessageEmbed()
			.setColor(color)
			.setTitle(`DEX Points Leaderboard`)
			.setDescription(`Current leaderboard of points for the DEX Discord.`)
			.setTimestamp()
			.setFooter('Pulled using the DEX Bot');

		// Pull all tag entries
		Points.findAll({ order: [['points', 'DESC']], attributes: ['username', 'points'], limit: 10 }).then((allUsers) => {

			allUsers.forEach((element, index) => { currentGame.addField(`${index+1}. ${element.dataValues['username']}`, element.dataValues['points'].toString()) });
			interaction.reply({ embeds: [currentGame], ephemeral: true });

		});

	},
};
