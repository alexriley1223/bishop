const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const sequelize = require("@database/database.js")(Sequelize);
const Points = require("@models/userPoints.js")(sequelize, Sequelize.DataTypes);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay another user with your points")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to pay").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Amount to Pay").setRequired(true)
    ),
  async execute(interaction) {
    const userReceive = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const userGive = interaction.user.id;

    // Check if points are less than or equal to 0
    if (amount <= 0) {
      interaction.reply({ content: "Cannot pay 0 or less than 0 points.", ephemeral: true });
      return;
    }

    // Check if userReceive exists
    await Points.findOne({
      where: {
        user: userReceive.id,
      },
    }).then(function (user) {
      if (!user) {
        interaction.reply({
          content: `Unable to find user: ${userReceive.username}.`,
          ephemeral: true,
        });
        return;
      }
    });

    // Check if userGive has enough points
    await Points.findOne({
      where: {
        user: userGive,
      },
    }).then(function (user) {
      if (user && user.points >= amount) {
        // Update userReceive points
        Points.increment("points", { by: amount, where: { user: userReceive.id } });

        // Update userGive points
        Points.increment("points", { by: -amount, where: { user: userGive } });

        interaction.reply({
          content: `${amount} points paid to ${userReceive.username}!`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `You do not have enough points to pay ${userReceive.username}.`,
          ephemeral: true,
        });
      }
    });
  },
};
