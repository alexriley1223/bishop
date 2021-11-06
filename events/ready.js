const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Sync userpoints database
		Points.sync();

		// REFACTOR: use fs to cycle jobs folder and generate this dynamically
		const dailyPoints = require('@jobs/addDailyPoints.js')(Points, client, sequelize);

		const createDatabaseBackup = require('@jobs/createDatabaseBackup.js')();

		// Set activity under member list
    client.user.setActivity('These Hands', { type: 'COMPETING' });

	},
};
