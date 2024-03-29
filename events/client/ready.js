const BishopEvent = require('@classes/BishopEvent');
const chalk = require('chalk');
const { color } = require('@config/bot');

module.exports = new BishopEvent({
	name: 'ready',
	once: true,
	init: (...opt) => {
		const client = opt[0];
		client.bishop.logger.success(
			'LOGI',
			`Ready! Logged in as ${chalk.bgHex(color).bold(client.user.tag)}`,
		);
	},
});
