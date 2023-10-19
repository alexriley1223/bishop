module.exports = async (client) => {
	const migrationFile = require('@handlers/database/2023_10_10_000000_create_migrations.js')(
		client.bishop.db,
		client.bishop.db.datatypes,
	);
	client.bishop.logger.info('Boot', 'Checking database migration status.');
	await migrationFile();
	client.bishop.logger.success('Boot', 'Migration table is up to date.');
};
