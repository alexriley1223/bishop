// Register aliases
require('module-alias/register');
const Sequelize = require('sequelize');
const sequelize = require('@database/database.js')(Sequelize);

// Models
require('@models/userPoints.js')(sequelize, Sequelize.DataTypes);
require('@models/vouchers.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
  console.log('Database synced.');
  sequelize.close();
}).catch(console.error);
