const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color, name } = require('@config/bot.json');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Stocks = require('@models/stocks.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewportfolio')
		.setDescription('List all current stocks in a users portfolio')
    .addUserOption(option =>
			option.setName('user')
				.setDescription('User to view portfolio of')
				.setRequired(true)),
 	async execute(interaction) {
    const user = interaction.options.getUser('user');

		/* Generate embed message for portfolio */
		const stockPortfolio = new MessageEmbed()
			.setColor(color)
			.setTitle(`${user.username}'s Stock Portfolio`)
			.setTimestamp()
			.setFooter(`Pulled using the ${name} Bot`);

		// Pull all tag entries
		Stocks.findAll({ where: {user: user.id }, order: [['shares', 'DESC']], attributes: ['symbol', 'shares'] }).then((allStocks) => {

			allStocks.forEach((element, index) => { stockPortfolio.addField(`${element.dataValues['symbol']}`, element.dataValues['shares'].toString()) });
			interaction.reply({ embeds: [stockPortfolio], ephemeral: true });

		});

	},
};
