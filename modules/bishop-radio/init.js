const { Player } = require('discord-player');

module.exports = function (client) {
    var module = {};
    
    module.name = 'Bishop Radio';
    module.description = 'A full-fledged web radio player for the Bishop Discord bot.';
    module.version = '1.0.0';
    module.enabled = true;
    
    module.init = function init() {
        const player = new Player(client);
        player.extractors.loadDefault();

        player.events.on('playerStart', (queue, track) => {
            client.user.setPresence({
                activities: [{ name: `${track.title} by ${track.author}`, type: ActivityType.Listening }],
            });
        });
        player.events.on('emptyQueue', (queue) => {
            setTimeout(() => {
                client.user.setPresence({
                    activities: [{ name: 'These Hands', type: ActivityType.Competing }],
                });
            }, 2000);
        });
        player.events.on('disconnect', (queue) => {
            setTimeout(() => {
                client.user.setPresence({
                    activities: [{ name: 'These Hands', type: ActivityType.Competing }],
                });
            }, 2000);
        });

        player.events.on('connectionDestroyed', (queue) => {
            setTimeout(() => {
                client.user.setPresence({
                    activities: [{ name: 'These Hands', type: ActivityType.Competing }],
                });
            }, 2000);
        });
    }

    return module;
}