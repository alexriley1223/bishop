const utils = require('@helpers/utils');

module.exports = {
	name: 'guildMemberRemove',
	execute(guildMember) {
		utils.fireModuleEvents(guildMember.client, this.name, guildMember);
	},
};
