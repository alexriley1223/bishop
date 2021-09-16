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
	name: 'voiceStateUpdate',
	execute(oldState, newState) {
		const Sequelize = require('sequelize');

		/* Check the user is not a bot */
		if(!newState.member.user.bot) {
			// Define member id
			const id = newState.id.toString();
			const username = newState.member.user.username

			/* User is joining a channel for the first time */
			if (oldState.channelId == null) {
				var date = Date.now();

				// Fetch tag
				Points.upsert(
					{
						user: id,
						username: username,
						lastJoin: date
					},
					{ user: id }
				).then(function(){
					console.log(`User ${id} created or already existing.`);
				});
			}

			/* User has fully disconnected */
			if (newState.channelId == null) {
				var date = Date.now();

				Points.findOne({ where:
					{
						user: id
					}
				}).then(function(user){
					if(user) {
						var oldTime = user.lastJoin;
						var newTime = Date.now();
						var points = user.points;

						//points += Math.floor((newTime-oldTime)/1000); // seconds
						points += Math.floor(((newTime-oldTime)/1000)/60); // minutes

						// Add onto the current points the user has
						Points.update({ points: points },{ where: { user: id }});
					}
				});

			}

			/* User has changed voice states inside of a channel */
			if (newState.channelId == oldState.channelId) {

			}

			/* User has switched channels */
			if (newState.channelId !== oldState.channelId) {

			}

		}
	},
};
