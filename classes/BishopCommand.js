module.exports = class BishopCommand {
	constructor(...opt) {
		opt = opt[0];

		this.enabled = opt.enabled;
		this.data = opt.data;
		this.execute = opt.execute;
	}

	async execute(interaction) {
		this.execute(interaction);
	}

	setEnabled(enabled) {
		this.enabled = enabled;
	}
};
