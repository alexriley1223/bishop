const { ActivityType } = require('discord.js');
const BishopModuleEvent = require('@classes/BishopModuleEvent');
const { getParentDirectoryString } = require('@helpers/utils');
const { events } = require('../config.json');

module.exports = new BishopModuleEvent({
	name: 'ready',
	enabled: events[getParentDirectoryString(__filename, __dirname, 'events')],
	init: async (client, ...opt) => {
		client.user.setPresence({
			activities: [{ name: 'These Hands', type: ActivityType.Competing }],
		});
	},
});