const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const { color, name } = require('@config/bot.json');
const { musicChannelId } = require('@config/channels.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a youtube audio track given a title/name.')
    .addStringOption(option => option.setName('name').setDescription('Name of song or video to be played').setRequired(true)),
 	async execute(interaction) {
		var searchSong = {};
		var nowPlaying;

		const existingConnection = getVoiceConnection(interaction.channel.guild.id);

		const searchFilters = await ytsr.getFilters(interaction.options.getString('name'));
		const searchFilter = searchFilters.get('Type').get('Video');
		const searchResults = await ytsr(searchFilter.url, { limit: 1 });

		// Check if ytsr returned any results
		// TODO: Add to limit and make user choice
		if(searchResults.items[0]) {
			searchSong.title = searchResults.items[0].title;
			searchSong.videoId = searchResults.items[0].id;
			searchSong.duration = searchResults.items[0].duration;
			searchSong.thumbnail = searchResults.items[0].bestThumbnail.url;

			nowPlaying = new MessageEmbed()
				.setColor(color)
				.setTitle('Now Playing')
				.setDescription(`${searchSong.title} (${searchSong.duration})`)
				.setThumbnail(searchSong.thumbnail)
				.setTimestamp()
				.setFooter(`Pulled using the ${name} Bot`);
		} else {
			await interaction.reply({ content: 'Unable to play or find audio.', ephemeral: true });
			return;
		}

	  if(existingConnection) {
			// We already have an audio playing, add to the queue
	    await interaction.reply({ content: `Audio is already playing. Your request has been added onto the queue!`, ephemeral: true });
			interaction.client.channels.cache.get(musicChannelId).send(`<@${interaction.user.id}> added **${searchSong.title}** into the queue.`);
			global.songQueue.push(searchSong);
	  } else {
			// New audio, do new audio logic
			global.songQueue = [];

			const connection = joinVoiceChannel({
	      channelId: interaction.member.voice.channel.id,
	      guildId: interaction.channel.guild.id,
	      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
	    });

			const stream = await ytdl(`https://www.youtube.com/watch?v=${searchSong.videoId}`, {filter:'audioonly'}, { quality: 'highestaudio', highWaterMark: 1<<25 });
			const resource = createAudioResource(stream, { inlineVolume: true });
			const player = createAudioPlayer({
	      behaviors: {
	        noSubscriber: NoSubscriberBehavior.Pause,
	      },
	    });

			connection.subscribe(player);
	    player.play(resource);

			// Setup Player state changes
			player.on('stateChange', (oldState, newState) => {
				// Player has stopped playing its audio
				if(newState.status == 'idle') {
					if(global.songQueue.length > 0) {
						var nextSong = global.songQueue.shift();

						var newStream = ytdl(`https://www.youtube.com/watch?v=${nextSong.videoId}`, {filter:'audioonly'}, {quality: '94'});
						var newResource = createAudioResource(newStream, { inlineVolume: true });

						var newNowPlaying = new MessageEmbed()
							.setColor(color)
							.setTitle('Now Playing')
							.setDescription(`${nextSong.title} (${nextSong.duration})`)
							.setThumbnail(nextSong.thumbnail)
							.setTimestamp()
							.setFooter(`Pulled using the ${name} Bot`);

						// Send new now playing embed
						interaction.client.channels.cache.get(musicChannelId).send({ embeds: [ newNowPlaying ]});

						// Play next song
						player.play(newResource);
					} else {
						// Nothing left in the queue, destroy the connection
						connection.destroy();
					}
				}
			});

			// Send now playing embed as reply
			await interaction.reply({ embeds: [ nowPlaying ] });
		}
	},
};
