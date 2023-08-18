module.exports = function(sequelize, DataTypes) {

    var definition = {};

    definition.enabled = false;

    definition.define = async function() {

        /* Define Table and Sync */
        await sequelize.define('Config', {
            entry: DataTypes.STRING,
        }).sync();

        /* Add any pre-existing data if needed - some extra logic needed to check */
        await sequelize.models.Config.create({
            entry: 'example',
        });
    }

    return definition;
}