const BishopEvent = require('@classes/BishopEvent');

module.exports = new BishopEvent({
	name: 'voiceStateUpdate',
	init: (...opt) => {
		/**
         * opt[0] -> oldState : VoiceState
         * opt[1] -> newState : VoiceState
         */
	},
});
