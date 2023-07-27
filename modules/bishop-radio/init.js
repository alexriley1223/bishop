const { Player } = require('discord-player');
const { ActivityType } = require('discord.js');

module.exports = function(client) {
	const module = {};

	module.name = 'Bishop Radio';
	module.description = 'A full-fledged web radio player for the Bishop Discord bot.';
	module.version = '1.0.0';
	module.enabled = true;

	module.init = function init() {
		const player = new Player(client);
		player.extractors.loadDefault();

		player.events.on('playerStart', (queue, track) => {
			setPresence(track);
		});
		player.events.on('emptyQueue', () => {
			setTimeout(() => {
				resetPresence();
			}, 2000);
		});
		player.events.on('disconnect', () => {
			setTimeout(() => {
				resetPresence();
			}, 2000);
		});

		player.events.on('connectionDestroyed', () => {
			setTimeout(() => {
				resetPresence();
			}, 2000);
		});
	};

	function resetPresence() {
		client.user.setPresence({
			activities: [{ name: 'These Hands', type: ActivityType.Competing }],
		});
	}

	function setPresence(track) {
		client.user.setPresence({
			activities: [{ name: `${track.title} by ${track.author}`, type: ActivityType.Listening }],
		});
	}

	return module;
};
