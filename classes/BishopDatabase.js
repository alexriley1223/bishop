const { Sequelize, DataTypes } = require("sequelize");
const databaseConfiguration = require('@config/database.json');
const log = require('@helpers/logger');

module.exports = class BishopDatabase extends Sequelize {
    constructor() {
        super(
            databaseConfiguration.database,
			databaseConfiguration.username,
			databaseConfiguration.password,
			{
				host: databaseConfiguration.host,
				port: databaseConfiguration.port,
				dialect: databaseConfiguration.driver,
				logging: (str) => {
					log.info('Sequ', str);
				},
				storage: `./database/${databaseConfiguration.name}.sqlite`,
			},
        );
		this.datatypes = DataTypes;
		this.migrations = [];
		this.batchNumber = 0;
    }

	async connect(client) {
		await require('@handlers/database/connectDatabase')(client);
	}

	/**
	 * Get current migrations in the database
	 */
	async getMigrations() {
		this.migrations = await this.models.migrations.findAll({ attributes: ['name'], raw: true }).then(migrationNames => migrationNames.map(migrationName => migrationName.name));
		this.batchNumber = await this.models.migrations.findOne({ limit: 1, order: [['createdAt', 'DESC']], raw: true}).then(firstMigration => firstMigration?.batch ? firstMigration.batch + 1 : null) ?? 1;
	}
}