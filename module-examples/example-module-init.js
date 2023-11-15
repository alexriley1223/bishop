const package = require('./package');
const BishopModule = require('@classes/BishopModule');

module.exports = (client) => {
	return new BishopModule({
		name: 'Bishop Module',
		description: package.description,
		version: package.version,
		enabled: true,
		author: package.author,
		directory: __dirname,
		init: function() {
		},
	});
};

