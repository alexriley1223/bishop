const up = (sequelize) => {
	const queryInterface = sequelize.getQueryInterface();
	const DataTypes = sequelize.datatypes;
	
	queryInterface.createTable('table_name', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		}
	});
}

const down = (sequelize) => {
	const queryInterface = sequelize.getQueryInterface();
	queryInterface.dropTable('table_name');
}

module.exports = {
	up,
	down
}
