module.exports = class BishopJob {

    constructor(...opt){
        opt = opt[0];
        
        this.enabled = opt.enabled;
        this.init = opt.init;
    };

    async execute(client) {
        await this.init(client);
    }
};