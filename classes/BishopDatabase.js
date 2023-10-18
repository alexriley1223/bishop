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
    }

	async connect(client) {
		await require('@handlers/database/connectDatabase')(client);
	}
}