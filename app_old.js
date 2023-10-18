require('module-alias/register');

const fs = require('fs');

const log = require('@helpers/logger');
const utils = require('@helpers/utils');

const BishopClient = require('@classes/BishopClient.js');

main();
/* Initiate Bot */
async function main() {

	const client = new BishopClient();
	client.login();

	console.log(client.bishop.db.models);
	return;

	/* All available database migrations */
	let moduleDatabaseMigrations = {};

	/* Return a simple array of strings of all migrations */
	let migrationEntries = await sequelize.models.migrations.findAll({ attributes: ['name'], raw: true }).then(migrationNames => migrationNames.map(migrationName => migrationName.name));
	const migrationBatchNumber = await sequelize.models.migrations.findOne({ limit: 1, order: [['createdAt', 'DESC']], raw: true}).then(firstMigration => firstMigration?.batch ? firstMigration.batch + 1 : null) ?? 1;

	/* Load Modules */
	modules.forEach((m) => {
		if (m.isDirectory()) {
			if (fs.existsSync(`./modules/${m.name}/init.js`)) {
				if (!fs.existsSync(`./modules/${m.name}/config.json`)) {
					log.error(
						'Boot',
						`❌ Failed to attempt to load module ${m.name}. Missing configuration file.`,
					);
					return;
				}


				if (module.enabled) {


					/* Register module events to client events object */
					if (fs.existsSync(`./modules/${m.name}/events`)) {
						let events = utils.getAllFiles(`./modules/${m.name}/events`);
						const evtConfig = require(`./modules/${m.name}/config.json`).events;
						const verifiedEvents = [];

						/* Check if events are enabled in config - handled differently than other types */
						for (const i of events) {
							const trimmed = i.replace(`modules/${m.name}/events/`, '');

							/* Check file name against config */
							if (evtConfig[trimmed]) {
								verifiedEvents.push(i);
							}
						}

						events = verifiedEvents;

						if (events.length > 0) {
							log.info(
								'Boot',
								`🔄 █ Starting to load ${module.name} events. ${events.length} discovered.`,
							);

							let eventCount = 0;

							for (const file of events) {
								const singleName = file.split('/').slice(-1).join();
								if (!fs.existsSync(`./events/${singleName}`)) {
									log.error(
										'Boot',
										`❌ █ Failed to load event ${singleName} for ${module.name}. Please ensure the template event exists in ~/events.`,
									);
								}

								const singleNameNoExt = singleName.replace('.js', '');

								if (!client.bishop.events) {
									client.bishop.events = {};
								}

								if (!client.bishop.events[singleNameNoExt]) {
									client.bishop.events[singleNameNoExt] = [];
								}

								client.bishop.events[singleNameNoExt].push(file);

								eventCount++;
							}

							log.info('Boot', `✅ █ ${eventCount} ${module.name} events loaded.`);
						}
					}

					/* Get list of all migrations */
					if (fs.existsSync(`./modules/${m.name}/database`) && databaseConfiguration.useDatabase) {
						const migrations = utils.getAllFiles(`./modules/${m.name}/database`);
						if (migrations.length > 0) {
							for (const file of migrations) {

								/* If migration isn't already ran, add it to migrate list */
								if(!migrationEntries.includes(file.replace(`modules/${m.name}/database/`, '').replace('.js', ''))) {
									if(!moduleDatabaseMigrations[m.name]) {
										moduleDatabaseMigrations[m.name] = [];
									}
									moduleDatabaseMigrations[m.name].push(file);
								}
							}
						}
					}

					/* Register any Jobs */
					if (fs.existsSync(`./modules/${m.name}/jobs`)) {
						const jobs = utils.getAllFiles(`./modules/${m.name}/jobs`);
						if (jobs.length > 0) {
							log.info(
								'Boot',
								`🔄 █ Starting to load ${module.name} jobs. ${jobs.length} discovered.`,
							);

							let jobCount = 0;

							for (const file of jobs) {
								const job = require(`./${file}`)(client);
								if (job.enabled) {
									job.executeJob();
									jobCount++;
								}
							}

							log.info('Boot', `✅ █ ${jobCount} ${module.name} jobs loaded.`);
						}
					}

					/* Add to module array */
					client.bishop.modules.push(`${module.name}`);

					log.info('Boot', `😋 Done loading module ${module.name} (${module.version}).`);
				}
			}
		}
	});

	/* Make our migrations one array, sort it, and then run them */
	const flattenedMigrations = Object.values(moduleDatabaseMigrations).flat().sort();
	flattenedMigrations.forEach((migration) => {
		let migrationDefinition = require(`./${migration}`)(sequelize, DataTypes);
		let shortName = migration.replace(/modules.*database\//, '').replace('modules//database/', '').replace('.js', '');

		try {
			log.info(
				'Boot',
				`🔄 █ Starting to migrate ${shortName}.`,
			);
			migrationDefinition.define();
			sequelize.models.migrations.create({ name: `${shortName}`, batch: migrationBatchNumber});
			log.info(
				'Boot',
				`✅ Successfully migrated ${shortName}.`,
			);
		} catch (error) {
			log.error('Boot', `❌ Failed to migrate ${shortName}.`);
		}
		
	});
	
}
