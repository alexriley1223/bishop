const log = require('@helpers/logger');
const utils = require('@helpers/utils');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		log.info('Boot', `Ready! Logged in as ${client.user.tag}`);
		utils.fireModuleEvents(client, this.name);
	},
};
