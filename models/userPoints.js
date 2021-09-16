module.exports = (sequelize, DataTypes) => {
	return sequelize.define('points', {
    user: {
      type: DataTypes.STRING,
			allowNull: false,
      unique: true,
    },
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastJoin: {
			type: DataTypes.INTEGER,
		},
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
	});
};
