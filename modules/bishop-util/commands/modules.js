const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
	.setName('modules')
	.setDescription('Show current loaded Bishop modules'),
	execute: async function(interaction) {
		const modArray = [...interaction.client.bishop.modules.values()].map(a => a['name'] + " (" + a['version'] + ")");

		const queueEmbed = new EmbedBuilder()
			.setColor(`${interaction.client.bishop.color}`)
			.setTitle('Current Loaded Modules')
			.setDescription(`${modArray.join('\n')}`)
			.setTimestamp()
			.setFooter({
				text: `Pulled using the ${interaction.client.bishop.name} Bot`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
		});

		await interaction.reply({ ephemeral: true, embeds: [queueEmbed] });
	},
});

