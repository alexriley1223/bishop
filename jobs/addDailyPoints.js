const cron = require('cron');

module.exports = (Points, client, sequelize) => {
    // Make cron job for adding in weekly points
    // 0 12 * * *
    addRandomPointsDaily = new cron.CronJob('0 12 * * *', () => {
      Points.findAll({ order: sequelize.random(), limit: 1 }).then(function(user){

        // Generate random points and calculated point value
        var randPoints = Math.floor(Math.random() * (30 - 10) + 10);
        var points = user[0].points + randPoints;

        // Add onto the current points the user has
        Points.update({ points: points },{ where: { user: user[0].user }});

        // Send @ message in announcements channel
        client.channels.cache.get('767982180961484820').send(`Congrats <@${user[0].user}>! You have won ${randPoints} points for today's free points raffle! 👏🏻`);

        console.log(`RAFFLE: Adding ${randPoints} points to ${user[0].username}.`);
      });
    });

    return addRandomPointsDaily.start();

};
