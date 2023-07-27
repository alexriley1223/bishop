const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const sequelize = require("@database/database.js")(Sequelize);
const Points = require("@models/userPoints.js")(sequelize, Sequelize.DataTypes);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modifypoints")
    .setDescription("Modify points to a given user")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of modification to execute")
        .setRequired(true)
        .addChoices(
          {
            name: "add",
            value: "add",
          },
          {
            name: "remove",
            value: "remove",
          },
          {
            name: "set",
            value: "set",
          }
        )
    )
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Amount to modify").setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to pay").setRequired(true)
    ),
  execute(interaction) {
    const type = interaction.options.getString("type");
    const modifyUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    Points.findOne({
      where: {
        user: modifyUser.id,
      },
    }).then(function (user) {
      if (user) {
        let points = user.points;

        switch (type) {
          case "add":
            points += amount;
            break;

          case "remove":
            points -= amount;
            break;

          case "set":
            points = amount;
            break;
        }

        // Add onto the current points the user has
        Points.update({ points: points }, { where: { user: modifyUser.id } });

        // Send response
        interaction.reply({
          content: `Successfully modified points of ${modifyUser.username}!`,
          ephemeral: true,
        });
      } else {
        interaction.reply({ content: `User not found: ${modifyUser.username}`, ephemeral: true });
      }
    });
  },
};
