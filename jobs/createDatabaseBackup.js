const fs = require('fs');
const cron = require('cron');
const path = require('path');

module.exports = function() {
    // Cron job to create database backup daily
    var createDatabaseBackup = new cron.CronJob('0 0 * * *', () => {

      const currentDate = new Date().toISOString().split('T')[0];

      // Create directory if not exist
      if(!fs.existsSync(path.join(__dirname, '../backup'))) {
        console.log('Creating backup directory');
        fs.mkdirSync(path.join(__dirname, '../backup'));
      }
      // Make backup
      fs.copyFile(path.join(__dirname, '../database/database.sqlite'), path.join(__dirname, `../backup/database_${currentDate}.sqlite`), (err) => {
        if(err) {
          console.log('FATAL: Database failed to backup.\n' + err);
        } else {
          console.log('Database has been backed up.');
        }
      });
    });

    return createDatabaseBackup.start();

};
