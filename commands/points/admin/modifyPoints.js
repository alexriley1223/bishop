const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modifypoints')
		.setDescription('Modify points to a given user')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of modification to execute')
        .setRequired(true)
        .addChoice('add', 'add')
        .addChoice('remove', 'remove')
        .addChoice('set', 'set'))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to modify')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('user')
        .setDescription('User to modify points of')
        .setRequired(true)),
 	execute(interaction) {
    const type = interaction.options.getString('type');
    const username = interaction.options.getString('user');
    const amount = interaction.options.getInteger('amount');
		Points.findOne({ where:
			{
				username: username
			}
		}).then(function(user){
			if(user) {
				var points = user.points;

        switch(type) {
          case 'add':
            points += amount;
            break;

          case 'remove':
            points -= amount;
            break;

          case 'set':
            points = amount;
            break;
        }

				// Add onto the current points the user has
				Points.update({ points: points },{ where: { username: username }});

        // Send response
        interaction.reply({content: `Successfully modified points of ${username}!`, ephemeral: true});
			} else {
        interaction.reply({content: `User not found: ${username}`, ephemeral: true});
      }
		});
	},
};
