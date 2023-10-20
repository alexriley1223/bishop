const BishopJob = require('@classes/BishopJob');
const fs = require('fs');
const cron = require('cron');
const path = require('path');
const { useBackupJob, driver } = require('@config/database.json');

module.exports = new BishopJob({
	enabled: driver && driver == 'sqlite' ? useBackupJob : false,
	init: async function(client) {
		const job = new cron.CronJob('* * * * *', () => {
			const currentDate = new Date().toISOString().split('T')[0];

			// Create directory if not exist
			if (!fs.existsSync(path.join(__dirname, '../../../backup'))) {
				console.log('Creating backup directory');
				fs.mkdirSync(path.join(__dirname, '../../../backup'));
			}
			// Make backup
			fs.copyFile(
				path.join(__dirname, '../../../database/database.sqlite'),
				path.join(__dirname, `../../../backup/database_${currentDate}.sqlite`),
				(err) => {
					if (err) {
						client.bishop.logger.error('DB', 'FATAL: Database failed to backup.\n' + err);
					}
					else {
						client.bishop.logger.success('DB', 'Database has been backed up.');
					}
				},
			);
		});

		job.start();
	},
});
