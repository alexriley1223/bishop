const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);
const Points = require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);
const { afkChannelId } = require('@config/channels.json');

module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState) {
		const Sequelize = require('sequelize');

		/* Check the user is not a bot */
		if(!newState.member.user.bot) {
			// Define member id
			const id = newState.id.toString();
			const username = newState.member.user.username;

			/* User is joining a main channel for the first time */
			/* User joins other channel from AFK Channel */
			if ((oldState.channelId == null && newState.channelId !== afkChannelId) || (oldState.channelId == afkChannelId && newState.channelId !== null)) {
				var date = Date.now();

				// Add record or update record
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

			/* User joins AFK channel from base */
			/* User has fully disconnected from a main channel */
			if ((oldState.channelId !== null && newState.channelId == afkChannelId) || (oldState.channelId !== afkChannelId && newState.channelId == null)) {
				// Update point values to stop point tracking
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

						console.log(`Points updated for ${id}.`);
					}
				});
			}

		}
	},
};
