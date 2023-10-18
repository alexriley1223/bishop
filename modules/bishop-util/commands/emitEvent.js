const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require('@discordjs/builders');
const { name, color } = require('@config/bot.json');

module.exports = {
	enabled: true,
	data: new SlashCommandBuilder()
		.setName('emitevent')
		.setDescription('Test emitted Discord.JS events')
		.addStringOption((option) =>
			option
				.setName('event')
				.setDescription('Event to emit')
				.setRequired(true)
				.addChoices(
					{ name: 'guildMemberAdd', value: 'guildMemberAdd' },
					{ name: 'guildMemberRemove', value: 'guildMemberRemove' },
					{ name: 'guildMemberUpdate', value: 'guildMemberUpdate' },
				),
		),
	async execute(interaction) {
		const choice = interaction.options.getString('event') ?? null;

		switch (choice) {
		case 'guildMemberAdd':
			interaction.client.emit('guildMemberAdd', interaction.member);
			break;

		case 'guildMemberRemove':
			interaction.client.emit('guildMemberRemove', interaction.member);
			break;

		case 'guildMemberUpdate':
			interaction.client.emit('guildMemberUpdate', interaction.member, interaction.member);
			break;
		}
		await interaction.reply({
			content: `${choice} has been emitted!`,
			ephemeral: true,
		});
	},
};
