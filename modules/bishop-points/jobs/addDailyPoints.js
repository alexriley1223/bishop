const cron = require("cron");

module.exports = (Points, client, sequelize) => {
  // Make cron job for adding in weekly points
  // 0 12 * * *
  const addRandomPointsDaily = new cron.CronJob("0 12 * * *", () => {
    Points.findAll({ order: sequelize.random(), limit: 1 }).then(function (user) {
      // Generate random points and calculated point value
      const randPoints = Math.floor(Math.random() * (30 - 10) + 10);
      const points = user[0].points + randPoints;

      // Add onto the current points the user has
      Points.update({ points: points }, { where: { user: user[0].user } });

      // Send @ message in announcements channel
      // Temp disable sending in announcements channel
      // client.channels.cache.get(announcementsChannelId).send(`Congrats <@${user[0].user}>! You have won ${randPoints} points for today's free points raffle! 👏🏻`);

      console.log(`RAFFLE: Adding ${randPoints} points to ${user[0].username}.`);
    });
  });

  return addRandomPointsDaily.start();
};
