const fs = require('fs');
const utils = require('@helpers/utils');

module.exports = (client) => {
	/* Recursive param only available for node 18+? Not for 16.14 */
	const bishopEvents = fs
		.readdirSync(`${__dirname}/../events/`, { recursive: true })
		.filter((file) => file.endsWith('.js'));

	const eventFiles = utils.getAllFiles(`${__dirname}/../events`);

	for (const file of eventFiles) {
		const event = require(file);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		}
	}
};
