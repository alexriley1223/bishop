const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { color } = require('@config/bot.json');

const avlFilters = [
	'Bassboost',
	'Chorus',
	'Compressor',
	'Dim',
	'Earrape',
	'Expander',
	'Fadein',
	'Flanger',
	'Gate',
	'Haas',
	'Karaoke',
	'Lofi',
	'Mcompand',
	'Mono',
	'Nightcore',
	'Normalizer',
	'Phaser',
	'Pulsator',
	'Reverse',
	'Softlimiter',
	'Subboost',
	'Surrounding',
	'Treble',
	'Vaporwave',
	'Vibrato',
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('filter')
		.setDescription('Play an audio filter over the current playback.')
		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('Clear all applied filters'),
		)
		.addSubcommand((subcommand) => subcommand.setName('show').setDescription('Show all filters'))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('toggle')
				.setDescription('Toggle an audio filter')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('Name of the filter')
						.setRequired(true)
						.addChoices(
							{ name: 'Bassboost', value: 'bassboost' },
							{ name: 'Chorus', value: 'chorus' },
							{ name: 'Compressor', value: 'compressor' },
							{ name: 'Dim', value: 'dim' },
							{ name: 'Earrape', value: 'earrape' },
							{ name: 'Expander', value: 'expander' },
							{ name: 'Fadein', value: 'fadein' },
							{ name: 'Flanger', value: 'flanger' },
							{ name: 'Gate', value: 'gate' },
							{ name: 'Haas', value: 'haas' },
							{ name: 'Karaoke', value: 'karaoke' },
							{ name: 'Lofi', value: 'lofi' },
							{ name: 'Mcompand', value: 'mcompand' },
							{ name: 'Mono', value: 'mono' },
							{ name: 'Nightcore', value: 'nightcore' },
							{ name: 'Normalizer', value: 'normalizer' },
							{ name: 'Phaser', value: 'phaser' },
							{ name: 'Pulsator', value: 'pulsator' },
							{ name: 'Reverse', value: 'reverse' },
							{ name: 'Softlimiter', value: 'softlimiter' },
							{ name: 'Subboost', value: 'subboost' },
							{ name: 'Surrounding', value: 'surrounding' },
							{ name: 'Treble', value: 'treble' },
							{ name: 'Vaporwave', value: 'vaporwave' },
							{ name: 'Vibrato', value: 'vibrato' },
						),
				),
		),
	async execute(interaction) {
		const subCmd = await interaction.options.getSubcommand(true);
		const queue = useQueue(interaction.guild.id);
		const filters = queue.filters.ffmpeg.getFiltersEnabled();

		switch (subCmd) {
		case 'clear':
			if (!filters.length) {
				return await interaction.reply({
					content: 'No filters are currently applied',
					ephemeral: true,
				});
			}

			queue.filters.ffmpeg.setFilters(false);

			return await interaction.reply({ content: 'Cleared all Bot playback filters.' });
			break;

		case 'toggle':
			const filterName = interaction.options.getString('name', true);
			queue.filters.ffmpeg.toggle(filterName);

			return await interaction.reply({
				content: `Audio filter ${filterName} has been applied to Bot playback.`,
			});
			break;

		default:
			const enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();
			const disabledFilters = queue.filters.ffmpeg.getFiltersDisabled();

			const enFDes = enabledFilters.map((f) => `${f} --> ✅`).join('\n');
			const disFDes = disabledFilters.map((f) => `${f} --> ❌`).join('\n');

			const embed = new EmbedBuilder()
				.setColor(color)
				.setTitle('Bot Playback Filters')
				.setDescription(`${enFDes}\n\n${disFDes}`);

			await interaction.reply({ ephemeral: true, embeds: [embed] });
		}
	},
};
