const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);
const modules = require('@config/modules.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Check if points module is enabled (REFACTOR WHEN MORE JOBS ARE IN)
		if(modules.points) {
			console.log('Points Jobs Enabled');
			// Sync userpoints database
			Points.sync();

			const dailyPoints = require('@jobs/addDailyPoints.js')(Points, client, sequelize);
		}

		// const createDatabaseBackup = require('@jobs/createDatabaseBackup.js')();

		// Set activity under member list
    client.user.setActivity('These Hands', { type: 'COMPETING' });

	},
};
