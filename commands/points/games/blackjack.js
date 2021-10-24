const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteraction } = require('discord.js');
const Sequelize = require('sequelize');
const { gameUpdatesChannelId } = require('../../../config.json');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite', // FUTURE: change to mysql or similar
	logging: false,
	// only for SQLite
	storage: 'database.sqlite',
});

const Points = require('../../../models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play a game of blackjack with your points!')
		.addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of points to bet with')
        .setRequired(true)),
 	async execute(interaction) {

		var userId = interaction.user.id;
		var userPoints = 0;
		var betAmount = interaction.options.getInteger('amount');

		/* Check if have enough points to bet with */
		await Points.findOne({ where:
			{
				user: userId
			}
		}).then(function(user){
			userPoints = user.points;
		});

		if(userPoints < betAmount) {
			await interaction.reply({ content: 'You do not have enough points to bet with!', ephemeral: true });
		} else {

			// Take out bet amount
			var preWinLosePoints = userPoints - betAmount;
			Points.update({ points: preWinLosePoints },{ where: { user: userId }});

			/* Generate Deck */
			var suits = ["spades", "diamonds", "clubs", "hearts"];
			var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

			// Never used these, but they're here
			var suitUnicode = ["♠", "♥", "♦", "♣"];

			// Build out deck and hand arrays
			var deck = new Array();
			var yourHand = new Array();
			var dealerHand = new Array();

			/* Generate Deck */
			for(var i = 0; i < suits.length; i++)
			{
				for(var x = 0; x < values.length; x++)
				{
					var card = {value: values[x], suit: suits[i]};
					deck.push(card);
				}
			}

			/* Shuffle Deck */
			for (var i = 0; i < 1000; i++)
			{
				var location1 = Math.floor((Math.random() * deck.length));
				var location2 = Math.floor((Math.random() * deck.length));
				var tmp = deck[location1];

				deck[location1] = deck[location2];
				deck[location2] = tmp;
			}

			/* Draw Dealer Card Face-Down */
			dealerHand.push(drawCard());

			/* Draw User Cards */
			yourHand.push(drawCard());
			yourHand.push(drawCard());

			/* Draw Dealer Card Face-Up */
			dealerHand.push(drawCard());

			/* Check if natural from yourHand */
			/* 1.5 bet */
			if(calculateValue(yourHand) == 21) {
				if(calculateValue(dealerHand) != 21) {
					// Dealer didn't blackjack, you win!
					var newPoints = preWinLosePoints + (betAmount*1.5);
					Points.update({ points: newPoints },{ where: { user: userId }});

					// Send to casino updates if not a dummy game
					if(betAmount > 0) {
						interaction.client.channels.cache.get(gameUpdatesChannelId).send(`<@${userId}> won ${betAmount*1.5} points on Solo Blackjack!`);
					}

					await interaction.reply({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Natural Winner!', ephemeral: true });
				} else {

					Points.update({ points: userPoints },{ where: { user: userId }});

					await interaction.reply({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer also scored a blackjack with: \n' + buildHandString(dealerHand), ephemeral: true });
				}
			} else {
				/* Generate embed message for leaderboard */
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('hit')
							.setLabel('Hit')
							.setStyle('SUCCESS'),
						new MessageButton()
							.setCustomId('stand')
							.setLabel('Stand')
							.setStyle('DANGER')
					);

				await interaction.reply({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer is showing: \n' + dealerHand[1]['value'] + ' of ' + dealerHand[1]['suit'], ephemeral: true, components: [row] });

				/* Button Logic */
				const filter = i => {
					return i.user.id === userId && (i.customId === 'hit' || i.customId === 'stand');
				};
				const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON' });

				collector.on('collect', async i => {

					if (i.customId === 'hit') {
						// Draw a card and add to the ~stack~
						yourHand.push(drawCard());

						// Calculate a bust
						if(calculateValue(yourHand) > 21) {
							// Bust
							await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n You bust!', ephemeral: true, components: [] });
							collector.stop();
						} else {
							// Still in the game
							await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer\'s hand is: \n' + buildHandString(dealerHand), ephemeral: true, components: [row] });
						}
					}

					if (i.customId === 'stand') {

						// Dealer must draw cards until his hand is 17 or greater
						while (calculateValue(dealerHand) < 17) {
							dealerHand.push(drawCard());
						}

						if (calculateValue(dealerHand) > 21) {
							// Dealer busts, player wins
							var newPoints = preWinLosePoints + (betAmount*2);
							Points.update({ points: newPoints },{ where: { user: userId }});

							// Send to casino updates if not a dummy game
							if(betAmount > 0) {
								interaction.client.channels.cache.get(gameUpdatesChannelId).send(`<@${userId}> won ${betAmount*2} points on Solo Blackjack!`);
							}

							await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer\'s hand is: \n' + buildHandString(dealerHand) + '\n Dealer busts! You receive ' + (betAmount * 2) + '!', ephemeral: true, components: [] });
						} else if (calculateValue(dealerHand) <= 21) {
							// Winner - your hand is better than dealer's
							if(calculateValue(yourHand) > calculateValue(dealerHand)) {
								var newPoints = preWinLosePoints + (betAmount*2);
								Points.update({ points: newPoints },{ where: { user: userId }});

								// Send to casino updates if not a dummy game
								if(betAmount > 0) {
									interaction.client.channels.cache.get(gameUpdatesChannelId).send(`<@${userId}> won ${betAmount*2} points on Solo Blackjack!`);
								}

								await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer\'s hand is: \n' + buildHandString(dealerHand) + '\n You win! You receive ' + (betAmount * 2) + '!', ephemeral: true, components: [] });
							}

							// Loser (dealer wins)
							if(calculateValue(dealerHand) > calculateValue(yourHand)) {
								await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer\'s hand is: \n' + buildHandString(dealerHand) + '\n Dealer wins!', ephemeral: true, components: [] });
							}

							// Tie - both 21 or tie in general
							if(calculateValue(dealerHand) == calculateValue(yourHand)) {
								var newPoints = preWinLosePoints + (betAmount);
								Points.update({ points: newPoints },{ where: { user: userId }});

								await i.update({ content: 'Your hand is: \n' + buildHandString(yourHand) + '\n Dealer\'s hand is: \n' + buildHandString(dealerHand) + '\n Tied with dealer! You receive ' + betAmount + ' back.', ephemeral: true, components: [] });
							}
						}

						collector.stop();

					}
				});

				collector.on('end', collected => console.log(`Collected ${collected.size} items`));

			}
		}


		/* Draw card from top of deck and remove from deck array */
		function drawCard()
		{
			return deck.pop();
		}

		/* Calculate value of current hand */
		function calculateValue(hand) {
			var total = 0;
			var aces = [];
			var normals = [];

			aces = hand.filter(function(card){
				return card.value == 'A';
			});

			normals = hand.filter(function(card){
				return card.value != 'A';
			});

			// Add in normal values first
			normals.forEach(function(card){

				/* Card is royalty */
				if(card.value == 'J' || card.value == 'Q' || card.value == 'K') {
					total += 10;
				} else {
					/* Card is face value */
					total += parseInt(card.value);
				}
			});

			// Add in Ace values - check if 1 or 11
			aces.forEach(function(card) {
				if((total + parseInt(card.value)) > 21) {
					total += 1;
				} else {
					total += 11;
				}
			});

			return total;
		}

		/* Build string that shows all cards in a hand */
		function buildHandString(hand) {
			var string = '';

			hand.forEach(function(card){
				string += `${card.value} of ${card.suit}\n`;
			});

			return string;
		}

	},
};
