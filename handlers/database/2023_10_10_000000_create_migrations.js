module.exports = (sequelize, DataTypes) => async function(){
	await sequelize
		.define('migrations', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			batch: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			})
		.sync();
};
