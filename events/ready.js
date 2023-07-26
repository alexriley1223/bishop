const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);
const modules = require('@config/modules.json');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		/*
		if (modules.points) {
			console.log('Points Jobs Enabled');
			// Sync userpoints database
			Points.sync();

			const dailyPoints = require('@jobs/addDailyPoints.js')(Points, client, sequelize);
		}
		*/

		// const createDatabaseBackup = require('@jobs/createDatabaseBackup.js')();

		// Set activity under member list
		client.user.setPresence({
			activities: [{ name: 'These Hands', type: ActivityType.Competing }],
		});
	},
};
