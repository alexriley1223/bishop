const { isModuleEnabled } = require('./config');
const BishopModule = require('@classes/BishopModule');

module.exports = (client) => {
	return new BishopModule({
		name: 'Bishop Utilities',
		description: 'Utility commands for Bishop.',
		version: '2.0.0',
		enabled: isModuleEnabled,
		author: 'Alex Riley',
		directory: __dirname,
		init: function() {
		},
	});
};
