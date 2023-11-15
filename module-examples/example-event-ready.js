const BishopModuleEvent = require('@classes/BishopModuleEvent');

module.exports = new BishopModuleEvent({
	name: 'ready', // Event name, look at Discord.JS docs to find this
	enabled: true,
	init: async (client, ...opt) => {
		// Runs after core Bishop event logic
	},
});
