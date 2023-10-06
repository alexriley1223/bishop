const utils = require('@helpers/utils');

module.exports = {
	name: 'channelUpdate',
	execute(oldChannel, newChannel) {
		utils.fireModuleEvents(oldChannel.client, this.name, oldChannel, newChannel);
	},
};
