const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewpoints')
		.setDescription('View any user\'s points, by username')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to view points of')
				.setRequired(true)),
 	async execute(interaction) {

    const viewUser = interaction.options.getUser('user');
    var userPoints = 0;

    // Find user record by id and set user points value
    await Points.findOne({ where:
			{
				user: viewUser.id
			}
		}).then(function(user){
      if(user) {
        userPoints = user.points;
        interaction.reply({ content: `${viewUser.username} currently has ${userPoints} points!`, ephemeral: true });
      } else {
        interaction.reply({ content: `Unable to find user: ${viewUser.username}.`, ephemeral: true });
      }
		});

	},
};
