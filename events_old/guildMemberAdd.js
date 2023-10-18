const utils = require('@helpers/utils');

module.exports = {
	name: 'guildMemberAdd',
	execute(guildMember) {
		utils.fireModuleEvents(guildMember.client, this.name, guildMember);
	},
};
