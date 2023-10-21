module.exports = class BishopModuleEvent {
	constructor(...opt) {
		opt = opt[0];
		this.name = opt.name;
		this.enabled = opt.enabled;
		this.init = opt.init;
	}

	async execute(client, ...opt) {
		this.init(client, opt[0]);
	}
};
