const { ActivityType } = require('discord.js');

module.exports = (client) => {
	// Set meme activity presence "Competing In These Hands"
	client.user.setPresence({
		activities: [{ name: 'These Hands', type: ActivityType.Competing }],
	});
};
