const { isModuleEnabled } = require('./config.json');

module.exports = function() {
	const module = {};

	module.name = 'Bishop Utils';
	module.description = 'Utility commands for Bishop.';
	module.version = '1.0.1';
	module.enabled = isModuleEnabled;

	module.init = function init() {
		/* ~empty~ */
	};
	return module;
};
