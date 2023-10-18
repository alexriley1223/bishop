const fs = require('fs');

module.exports = (client) => {
    const bishopEvents = fs.readdirSync(`${__dirname}/../events/`, { recursive: true }).filter((file) => file.endsWith('.js'));

	for (const file of bishopEvents) {
		const event = require(`${__dirname}/../events/${file}`);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		}
	}
}