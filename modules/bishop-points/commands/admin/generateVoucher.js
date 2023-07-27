const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const sequelize = require("@database/database.js")(Sequelize);
const Vouchers = require("@models/vouchers.js")(sequelize, Sequelize.DataTypes);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generatevoucher")
    .setDescription("Generate a points voucher")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Voucher amount").setRequired(true)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const code = Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join("");

    /* Make sure point amount is greater than 0 */
    if (amount < 1) {
      await interaction.reply({ content: "Point amount must be greater than 0.", ephemeral: true });
      return;
    }

    await Vouchers.create({
      code: code,
      amount: amount,
    }).then(function () {
      interaction.reply({
        content: "Generated code: " + code + ". Amount: " + amount,
        ephemeral: true,
      });
    });
  },
};
