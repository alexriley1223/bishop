const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateDependencyReport, joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const { createReadStream, createWriteStream, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const { musicChannelId, color } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a youtube audio track given a title/name.')
    .addStringOption(option =>
      option.setName('name')
      .setDescription('Name of song or video to be played')
      .setRequired(true)),
 	async execute(interaction) {
    /* Check if user has valid role */
    if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {

			/* Check if message is in the Music channel */
			if(interaction.channelId == musicChannelId) {
				const searchResults = await ytsr(interaction.options.getString('name'), { limit: 1 });

				// Results found
				if(searchResults.items[0])
				{
					// Defer reply
					await interaction.deferReply();

					let title = searchResults.items[0].title;
					let videoId = searchResults.items[0].id;
					let duration = searchResults.items[0].duration;
					let thumbnail = searchResults.items[0].bestThumbnail.url;

					const nowPlaying = new MessageEmbed()
						.setColor(color)
						.setTitle('Now Playing')
						.setDescription(`${title} (${duration})`)
						.setThumbnail(thumbnail)
						.setTimestamp()
						.setFooter('Pulled using the DEX Bot');

					// Create directory if not exist
		      if(!existsSync(join(__dirname, '../../tmp'))) {
		        console.log('Creating tmp directory');
		        mkdirSync(join(__dirname, '../../tmp'));
		      }

					const downloadVideo = async (videoId) => {
						return new Promise((resolve, reject) => {
							let dlvideo = ytdl('https://www.youtube.com/watch?v=' + videoId, { filter: 'audioonly', quality: 'lowestaudio' });
							dlvideo.pipe(createWriteStream('tmp/' + videoId + '.mp3'));
							dlvideo.on("finish", function(){
								return resolve(dlvideo);
							});
						});
					};

					var video;

					// Check if video ID already exists
					if(existsSync(join(__dirname, `../../tmp/${videoId}.mp3`))) {
						video = true;
		      } else {
						video = await downloadVideo(videoId);
					}

					if (video) {
						const connection = joinVoiceChannel({
							channelId: interaction.member.voice.channel.id,
							guildId: interaction.channel.guild.id,
							adapterCreator: interaction.channel.guild.voiceAdapterCreator,
						});

						const player = createAudioPlayer({
							behaviors: {
								noSubscriber: NoSubscriberBehavior.Pause,
							},
						});

						let resource = createAudioResource(createReadStream(join(__dirname, `../../tmp/${videoId}.mp3`)));

					 	player.play(resource);

						console.log(`Now playing ${title}`);

						// Subscribe the connection to the audio player (will play audio on the voice connection)
						const subscription = connection.subscribe(player);

						await interaction.editReply({ embeds: [nowPlaying] });
					} else {
						await interaction.editReply({content: 'Unable to play or find audio.', ephemeral: true});
					}
				} else {
					await interaction.reply({content: 'Unable to play or find audio.', ephemeral: true});
				}
			} else {
				await interaction.reply({content: 'You must be in the music channel to run this command.', ephemeral: true});
			}
    } else {
      await interaction.reply({content: 'You do not have permissions to run this command.', ephemeral: true});
    }
	},
};
