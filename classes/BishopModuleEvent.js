module.exports = class BishopModuleEvent {
    constructor(...opt) {
        opt = opt[0];
        this.name = opt.name;
        this.init = opt.init;
    }

    async execute(client, ...opt) {
        this.init(client, opt[0]);
    }
}