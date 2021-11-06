const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewpoints')
		.setDescription('View any user\'s points, by username')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('User to view points of')
        .setRequired(true)),
 	async execute(interaction) {

    const username = interaction.options.getString('user');
    var userPoints = 0;

    // Find user record by id and set user points value
    await Points.findOne({ where:
			{
				username: username
			}
		}).then(function(user){
      if(user) {
        userPoints = user.points;
        interaction.reply({ content: `${username} currently has ${userPoints} points!`, ephemeral: true });
      } else {
        interaction.reply({ content: `Unable to find user: ${username}.`, ephemeral: true });
      }
		});

	},
};
