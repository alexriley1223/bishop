const roles = require("@config/roles.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { color, name } = require("@config/bot.json");

module.exports = {
  data: new SlashCommandBuilder().setName("roles").setDescription("List all available roles."),
  async execute(interaction) {
    const hasError = false;

    /* Generate embed message for role list */
    const roleList = new MessageEmbed()
      .setColor(color)
      .setTitle(`${name} Roles`)
      .setDescription("Current attainable roles via point values.")
      .setTimestamp()
      .setFooter(`Pulled using the ${name} Bot`);

    /* Loop through all available roles */
    for (var i = 0; i < roles.roles.length; i++) {
      const serverRole = interaction.guild.roles.cache.find((r) => r.id === roles.roles[i].id);

      if (serverRole) {
        roleList.addField(`${serverRole.name}`, roles.roles[i].amount + " Points");
      } else {
        await interaction.reply({
          content: "Unable to fetch a role in role list!",
          ephemeral: true,
        });
        return;
      }
    }

    /* Show leaderboard if no error */
    await interaction.reply({ embeds: [roleList], ephemeral: true });
  },
};
