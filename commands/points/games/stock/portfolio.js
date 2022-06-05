const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color, name } = require('@config/bot.json');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Stocks = require('@models/stocks.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('portfolio')
		.setDescription('List all current stocks in your portfolio'),
 	async execute(interaction) {
		/* Generate embed message for portfolio */
		const stockPortfolio = new MessageEmbed()
			.setColor(color)
			.setTitle(`${interaction.user.username}'s Stock Portfolio`)
			.setTimestamp()
			.setFooter(`Pulled using the ${name} Bot`);

		// Pull all tag entries
		Stocks.findAll({ where: {user: interaction.user.id }, order: [['shares', 'DESC']], attributes: ['symbol', 'shares'] }).then((allStocks) => {

			allStocks.forEach((element, index) => { stockPortfolio.addField(`${element.dataValues['symbol']}`, element.dataValues['shares'].toString()) });
			interaction.reply({ embeds: [stockPortfolio], ephemeral: true });

		});

	},
};
