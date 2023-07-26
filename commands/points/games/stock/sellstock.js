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
		.setName('sellstock')
		.setDescription('Sell a selected stock')
		.addStringOption((option) =>
			option.setName('symbol').setDescription('Symbol of stock to sell').setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName('shares').setDescription('Amount of shares to sell').setRequired(true),
		),
	async execute(interaction) {
		const symbol = interaction.options.getString('symbol').toUpperCase();
		const numShares = interaction.options.getInteger('shares');
		const userId = interaction.user.id;
		const userPoints = 0;
		let stockPrice = 0;

		if (numShares <= 0) {
			interaction.reply({ content: 'Must sell more than 0 shares.', ephemeral: true });
			return;
		}

		// Get stock price
		await axios
			.get(
				`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alphaToken}`,
			)
			.then(function(response) {
				const data = response.data['Time Series (Daily)'];
				const longData = data[Object.keys(data)[0]];

				stockPrice = Math.ceil(longData['4. close']);
			})
			.catch(function(error) {
				interaction.reply({
					content: `Unable to retrieve stock data for ${symbol}`,
					ephemeral: true,
				});
				return;
			});

		// Get purchase entry for stock
		await Stocks.findOne({
			where: {
				user: userId,
				symbol: symbol,
			},
		})
			.then(function(stock) {
				if (!stock) {
					interaction.reply({
						content: 'Unable to retrieve stock entry. Please try again.',
						ephemeral: true,
					});
					return;
				}

				if (numShares > stock.shares) {
					interaction.reply({
						content: 'Trying to sell too many shares. Please try again.',
						ephemeral: true,
					});
					return;
				}

				const stockSellPrice = stockPrice * numShares;

				if (stock.shares - numShares == 0) {
					stock.destroy();
				}
				else {
					stock.increment('shares', { by: -numShares });
				}

				// Take out points
				Points.increment('points', { by: stockSellPrice, where: { user: userId } });

				interaction.client.channels.cache
					.get(gameUpdatesChannelId)
					.send(`<@${userId}> sold ${numShares} shares of ${symbol} for ${stockSellPrice} points!`);
				interaction.reply({
					content: `Stock(s) sold for ${stockSellPrice} points!`,
					ephemeral: true,
				});
			})
			.catch(function(error) {
				interaction.reply({
					content: 'Unable to retrieve stock entry. Please try again.',
					ephemeral: true,
				});
				return;
			});
	},
};
