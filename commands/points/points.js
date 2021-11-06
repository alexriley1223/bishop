const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Display the amount of points you have'),
 	async execute(interaction) {
    var userId = interaction.user.id;
    var userPoints = 0;

    // Find user record by id and set user points value
    await Points.findOne({ where:
			{
				user: userId
			}
		}).then(function(user){
      userPoints = user.points;
		});

    await interaction.reply({ content: 'You currently have ' + userPoints + ' points.', ephemeral: true });
	},
};
