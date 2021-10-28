module.exports = (sequelize, DataTypes) => {
	return sequelize.define('vouchers', {
    id: {
      type: DataTypes.INTEGER,
			autoIncrement: true,
      primaryKey: true
    },
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		redeemed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});
};
