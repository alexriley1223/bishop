const BishopJob = require('@classes/BishopJob');
const CronJob = require('cron').CronJob;

module.exports = new BishopJob({
	enabled: true,
	init: async function(client) {
		new CronJob(
			'0 9 * * *',
			async function() {

			},
			null,
			true,
			'America/Indianapolis');
	},
});
