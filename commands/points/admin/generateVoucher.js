const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite', // FUTURE: change to mysql or similar
	logging: false,
	// only for SQLite
	storage: 'database.sqlite',
});

const Vouchers = require('@models/vouchers.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generatevoucher')
		.setDescription('Generate a points voucher')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Voucher amount')
        .setRequired(true)),
 	async execute(interaction) {
    if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      const amount = interaction.options.getInteger('amount');
      const code = Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join('');

      await Vouchers.create(
        {
          code: code,
          amount: amount,
        }
      ).then(function(){
        interaction.reply({content: 'Generated code: ' + code + '. Amount: ' + amount, ephemeral: true});
      });

    } else {
      await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
    }

	},
};
