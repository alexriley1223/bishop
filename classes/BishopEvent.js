module.exports = class BishopEvent {
	constructor(...opt) {
		opt = opt[0];

		this.name = opt.name;
		this.once = opt.once;
		this.init = opt.init;
	}

	fireModuleEvents(client, ...opt) {
		if (client.bishop.events[this.name]) {
			client.bishop.events[this.name].forEach(function(event) {
				const moduleEvent = require(event);
				moduleEvent.init(client, opt[0]);
			});
		}
	}

	async execute(client, ...opt) {
		await this.init(opt[0]);
		await this.fireModuleEvents(client, opt[0]);
	}
};
