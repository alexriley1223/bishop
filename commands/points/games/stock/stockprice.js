const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { color, name } = require('@config/bot.json');
const { alphaToken } = require('@config/api.json');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stockprice')
		.setDescription('See price of a selected stock')
    .addStringOption(option =>
      option.setName('symbol')
        .setDescription('Symbol of stock to check price')
        .setRequired(true)),
 	execute(interaction) {
    var symbol = interaction.options.getString('symbol');

    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alphaToken}`)
      .then(function (response) {
        var data = response.data['Time Series (Daily)'];
        var longData = data[Object.keys(data)[0]];
        var close = Math.ceil(longData['4. close']);

        interaction.reply({ content: `${symbol} is currently worth ${close} points per share!`, ephemeral: true });
      })
      .catch(function (error) {
        interaction.reply({ content: `Unable to retrieve stock data for ${symbol}`, ephemeral: true });
      });
	},
};
