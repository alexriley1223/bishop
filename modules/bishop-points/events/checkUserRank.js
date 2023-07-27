const Sequelize = require("sequelize");
const sequelize = require("@database/database.js")(Sequelize);
const Points = require("@models/userPoints.js")(sequelize, Sequelize.DataTypes);
const roles = require("@config/roles.json");
const modules = require("@config/modules.json");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    /* Check the user is not a bot */
    if (!newState.member.user.bot && modules.points) {
      // User joins any channel
      if (newState.channelId !== null) {
        const id = newState.id.toString();
        let userModel;

        await Points.findOne({
          where: {
            user: id,
          },
        }).then(function (record) {
          if (record) {
            userModel = record.dataValues;
          }
        });

        if (userModel !== undefined) {
          // Points found, let's get roles
          let currentRole;
          let currentTier;
          let upgradeRole;
          let upgradeTier;

          // Check if user already has a role
          for (let i = 0; i < roles.roles.length; i++) {
            // Check if user has role
            if (newState.member.roles.cache.has(roles.roles[i].id)) {
              currentRole = roles.roles[i].id;
              currentTier = roles.roles[i].tier;
            }

            // Check for potential upgrades
            if (i !== roles.roles.length - 1) {
              if (
                userModel.points >= roles.roles[i].amount &&
                userModel.points < roles.roles[i + 1].amount
              ) {
                upgradeRole = roles.roles[i].id;
                upgradeTier = roles.roles[i].tier;
              }
            } else if (userModel.points >= roles.roles[i].amount) {
              upgradeRole = roles.roles[i].id;
              upgradeTier = roles.roles[i].tier;
            }
          }

          if (currentRole !== undefined) {
            // Member has current role, check if due for an upgrade
            if (currentTier < upgradeTier) {
              // Remove current role
              newState.member.roles.remove(currentRole);

              // Add new role
              newState.member.roles.add(upgradeRole);
            }
          } else {
            // Weird check case where first tier minimum isn't 0, but 1
            if (upgradeRole !== undefined) {
              // Member does not have a role, let's assign one
              newState.member.roles.add(upgradeRole);
            }
          }
        }
      }
    }
  },
};
