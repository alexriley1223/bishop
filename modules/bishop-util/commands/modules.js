const { SlashCommandBuilder } = require('@discordjs/builders');
const { name, color } = require('@config/bot.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('modules')
		.setDescription('Show current loaded Bishop modules'),
	async execute(interaction) {
		const queueEmbed = new EmbedBuilder()
			.setColor(color)
			.setTitle('Current Loaded Modules')
			.setDescription(`${interaction.client.bishop.modules.join('\n')}`)
			.setTimestamp()
			.setFooter({
				text: `Pulled using the ${name} Bot`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.reply({ ephemeral: true, embeds: [queueEmbed] });
	},
};
