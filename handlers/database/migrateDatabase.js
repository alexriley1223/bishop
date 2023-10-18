module.exports = async (client) => {  
    /* Make sure migration table exists */
    const migrationFile = require('@handlers/database/2023_10_10_000000_create_migrations.js')(client.bishop.db, DataTypes);

    log.info('Boot', "🔄 Checking database migration status.");
    await migrationFile.define().then(() => {
        log.info('Boot', "✅ Migration table is setup!");
    });
}