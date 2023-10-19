const migrateDatabase = require('@handlers/database/migrateDatabase');

module.exports = (client) => {
    migrateDatabase(client).then(() => {
        client.bishop.db.getMigrations().then(() => {
            let newMigrations = client.bishop.migrations.filter(val => !client.bishop.db.migrations.includes(val.split('/migrations/')[1].replace('.js', '')));
            newMigrations = newMigrations.sort();
    
            newMigrations.forEach((migration) => {
                let migrationDefinition = require(migration)(client.bishop.db, client.bishop.db.datatypes);
                let migrationName = migration.split('/migrations/')[1].replace('.js', '');
        
                try {
                    client.bishop.logger.info(
                        'Boot',
                        `Starting to migrate ${migrationName}.`,
                    );
                    migrationDefinition();
                    client.bishop.db.models.migrations.create({ name: migrationName, batch: client.bishop.db.batchNumber });
                    client.bishop.logger.success(
                        'Boot',
                        `Successfully migrated ${migrationName}.`,
                    );
                } catch (error) {
                    client.bishop.logger.error('Boot', `Failed to migrate ${migrationName}.`);
                }
                
            });
        });
    });
}