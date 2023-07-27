const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const { gameUpdatesChannelId } = require("@config/channels.json");
const sequelize = require("@database/database.js")(Sequelize);
const Points = require("@models/userPoints.js")(sequelize, Sequelize.DataTypes);

const maxBet = 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Play a game of coinflip! Max bet of " + maxBet + " points.")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Amount of points to bet with").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Side of the coin to pick")
        .setRequired(true)
        .addChoices(
          {
            name: "heads",
            value: "heads",
          },
          {
            name: "tails",
            value: "tails",
          }
        )
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const betAmount = interaction.options.getInteger("amount");
    let userPoints = 0;

    /* Check if bet amount is within the limits */
    if (betAmount > maxBet || betAmount < 0) {
      await interaction.reply({
        content: "You can't bet less than 0 or more than " + maxBet + "!",
        ephemeral: true,
      });
      return;
    }

    /* Get user's points */
    await Points.findOne({
      where: {
        user: userId,
      },
    }).then(function (user) {
      userPoints = user.points;
    });

    /* Check if have enough points to bet with */
    if (userPoints < betAmount) {
      await interaction.reply({
        content: "You do not have enough points to bet with!",
        ephemeral: true,
      });
      return;
    } else {
      const userChoice = interaction.options.getString("side");
      /* Do the coinflip */
      const coin = Math.random() >= 0.5 ? "heads" : "tails";

      if (coin == userChoice) {
        const winnerPoints = userPoints + betAmount;

        Points.update({ points: winnerPoints }, { where: { user: userId } });

        if (betAmount > 0) {
          interaction.client.channels.cache
            .get(gameUpdatesChannelId)
            .send(`<@${userId}> won ${betAmount * 2} points on Solo Coinflip!`);
        }

        await interaction.reply({ content: `Coin is ${coin}. You win!`, ephemeral: true });
      } else {
        const loserPoints = userPoints - betAmount;

        Points.update({ points: loserPoints }, { where: { user: userId } });

        await interaction.reply({ content: `Coin is ${coin}. You lose!`, ephemeral: true });
      }
    }
  },
};
