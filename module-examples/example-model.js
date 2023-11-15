module.exports = async (sequelize, DataTypes) => {
    sequelize.define("table_name_plural", {
        id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		}
    });
}