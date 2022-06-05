const { SlashCommandBuilder } = require('@discordjs/builders');
const { alphaToken } = require('@config/api.json');
const { gameUpdatesChannelId } = require('@config/channels.json');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Stocks = require('@models/stocks.js')(sequelize, Sequelize.DataTypes);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buystock')
		.setDescription('Buy a selected stock')
    .addStringOption(option =>
      option.setName('symbol')
        .setDescription('Stock symbol to buy')
        .setRequired(true))
		.addIntegerOption(option =>
			option.setName('shares')
				.setDescription('Amount of shares to buy')
				.setRequired(true)),
 	async execute(interaction) {
    var symbol = interaction.options.getString('symbol').toUpperCase();
		var numShares = interaction.options.getInteger('shares');
		var userId = interaction.user.id;
		var userPoints = 0;
		var stockPrice = 0;

		if(numShares <= 0) {
			interaction.reply({ content: `Must buy more than 0 shares.`, ephemeral: true });
			return;
		}

		// Get stock price
    await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alphaToken}`)
      .then(function (response) {
        var data = response.data['Time Series (Daily)'];
        var longData = data[Object.keys(data)[0]];

        stockPrice = Math.ceil(longData['4. close']);
      })
      .catch(function (error) {
        interaction.reply({ content: `Unable to retrieve stock data for ${symbol}`, ephemeral: true });
				return;
      });

		// Check if user has enough points
		await Points.findOne({ where:
			{
				user: userId
			}
		}).then(function(user){
			userPoints = user.points;
		})
		.catch(function(error) {
			interaction.reply({ content: `Unable to retrieve user information. Please try again.`, ephemeral: true });
			return;
		});

		var stockBuyPrice = stockPrice * numShares;
		if (userPoints < (stockBuyPrice)) {
      await interaction.reply({ content: 'You do not have enough points to buy with!', ephemeral: true });
      return;
		} else {

			// Create stock purchase entry
			await Stocks.findOrCreate({
				where: {
					user: userId,
					symbol: symbol
				},
				defaults: {
					user: userId,
					symbol: symbol,
					shares: numShares
				}
			}).then(function(result) {
				var entry = result[0];
				var created = result[1];

				if(!created) {
					// User already has shares of stock
					entry.increment('shares', { by: numShares });
				}

				// Take out points
				Points.increment('points', { by: -stockBuyPrice, where: { user: userId }});

				interaction.client.channels.cache.get(gameUpdatesChannelId).send(`<@${userId}> bought ${numShares} shares of ${symbol} for ${stockBuyPrice} points!`);
				interaction.reply({ content: `Stock(s) bought for ${stockBuyPrice} points!`, ephemeral: true });
			});
		}

	},
};
