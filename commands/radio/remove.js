const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove a track from the queue.')
        .addIntegerOption(option => option.setName('index').setDescription('Track index to remove. Use /queue to check.').setRequired(true)),
 	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue?.size < 1) { return interaction.reply({ content: `The queue has no more tracks.`, ephemeral: true }); }
		
        const index = interaction.options.getInteger("index", true) - 1; // Remove one since we're adding +1 in queue

        if (index > queue.size || index < 0) { return interaction.reply({ content: `Not a valid queue index.`, ephemeral: true }); }
		
        queue.node.remove(index);
	
		return interaction.reply({ content: `Removed track ${index + 1} from the queue.` });
	},
};
