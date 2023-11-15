const migrateDatabase = require('@handlers/database/migrateDatabase');

module.exports = async (client) => {
	await migrateDatabase(client).then(() => {
		client.bishop.db.getMigrations().then(() => {
			let newMigrations = client.bishop.migrations.filter(
				(val) =>
					!client.bishop.db.migrations.includes(val.split('/migrations/')[1].replace('.js', '')),
			);
			newMigrations = newMigrations.sort();

			newMigrations.forEach((migration) => {
				const migrationDefinition = require(migration);
				const migrationName = migration.split('/migrations/')[1].replace('.js', '');
				
				try {
					client.bishop.logger.info('Boot', `Starting to migrate ${migrationName}.`);
					migrationDefinition.up(client.bishop.db);
					client.bishop.db.models.migrations.create({
						name: migrationName,
						batch: client.bishop.db.batchNumber,
					});
					client.bishop.logger.success('Boot', `Successfully migrated ${migrationName}.`);
				}
				catch (error) {
					client.bishop.logger.error('Boot', `Failed to migrate ${migrationName}.\n${error}`);
				}
			});
		});
	});
};
