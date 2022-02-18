const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botUpdatesChannel } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('subscribetobotupdates')
		.setDescription('Subscribe to bot updates channel'),
 	async execute(interaction) {
    var channel = interaction.client.channels.cache.get(botUpdatesChannel);

    channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, });

    await interaction.reply({ content: 'Successfully subscribed to bot updates!', ephemeral: true });
	},
};
