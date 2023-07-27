module.exports = (sequelize, DataTypes) => {
  return sequelize.define("stocks", {
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
