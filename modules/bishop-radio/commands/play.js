const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue, useMainPlayer } = require('discord-player');
const { color, name } = require('@config/bot.json');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a youtube audio track given a title/name.')
		.addStringOption((option) =>
			option.setName('name').setDescription('Name of song or video to be played').setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const query = interaction.options.getString('name', true);

		const player = useMainPlayer();
		const queue = useQueue(interaction.guild.id);
		const userChannel = interaction.member?.voice?.channel;

		// Not in a channel
		if (!userChannel) {
			return await interaction.editReply('You are not in a voice channel!');
		}

		if (queue && queue.channel.id !== userChannel.id) {
			return await interaction.editReply('I\'m already playing in a different voice channel!');
		}

		if (!userChannel.viewable) {
			return await interaction.editReply('I need `View Channel` permissions!');
		}

		if (!userChannel.joinable) {
			return await interaction.editReply('I need `Connect Channel` permissions!');
		}

		if (userChannel.full) {
			return await interaction.editReply('Voice channel is full!');
		}

		if (interaction.member.voice.deaf) {
			return await interaction.editReply('You cannot run this command while deafened!');
		}

		if (interaction.guild.members.me?.voice?.mute) {
			return await interaction.editReply('Please unmute me before playing!');
		}

		const searchResult = await player
			.search(query, { requestedBy: interaction.user })
			.catch(() => null);

		if (!searchResult?.hasTracks()) {
			return await interaction.editReply(`No track was found for ${query}!`);
		}

		try {
			await player.play(userChannel, searchResult.tracks[0], {
				nodeOptions: {
					metadata: interaction.channel,
				},
			});

			const newNowPlaying = new EmbedBuilder();

			if (queue) {
				newNowPlaying
					.setColor(color)
					.setTitle('Added to Queue')
					.setDescription(`${searchResult.tracks[0].title} (${searchResult.tracks[0].duration})`)
					.setThumbnail(searchResult.tracks[0].thumbnail)
					.setTimestamp()
					.setFooter({ text: `Pulled using the ${name} Bot` });
			}
			else {
				newNowPlaying
					.setColor(color)
					.setTitle('Now Playing')
					.setDescription(`${searchResult.tracks[0].title} (${searchResult.tracks[0].duration})`)
					.setThumbnail(searchResult.tracks[0].thumbnail)
					.setTimestamp()
					.setFooter({ text: `Pulled using the ${name} Bot` });
			}

			// Send new now playing embed
			interaction.client.channels.cache.get(musicChannelId).send({ embeds: [newNowPlaying] });
			if (queue) {
				return await interaction.editReply(`Added ${searchResult.tracks[0].title} to queue`);
			}
			else {
				return await interaction.editReply(`Now playing ${searchResult.tracks[0].title}`);
			}
		}
		catch (e) {
			console.log(e);
			return await interaction.editReply('Something went wrong. Please try again.');
		}
	},
};
