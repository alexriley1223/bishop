const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite', // FUTURE: change to mysql or similar
	logging: false,
	// only for SQLite
	storage: 'database.sqlite',
});

const Points = require('../models/userPoints.js')(sequelize, Sequelize.DataTypes);

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Sync userpoints database
		Points.sync();

		// REFACTOR: use fs to cycle jobs folder and generate this dynamically
		const dailyPoints = require('../jobs/addDailyPoints.js')(Points, client, sequelize);

		// Set activity under member list
    client.user.setActivity('These Hands', { type: 'COMPETING' });

	},
};
