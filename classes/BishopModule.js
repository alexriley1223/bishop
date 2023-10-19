require('module-alias/register');

const utils = require('@helpers/utils');
const log = require('@helpers/logger');
const fs = require('fs');

module.exports = class BishopModule {
    constructor(...opt) {
        opt = opt[0];
        this.name = opt.name;
        this.description = opt.description;
        this.version = opt.version;
        this.enabled = opt.enabled;
        this.directory = opt.directory;
        this.init = opt.init;
        this.author = opt.author;

        this.shortname = '';
    }

    async runInit() {
        await this.init();
    }

    getCommands(client) {
        if(!fs.existsSync(`${this.directory}/commands`)) {
            log.info('Boot', `No command directory found for ${this.shortname}. Proceeding.`);
            return [];
        }

        const commands = utils.getAllFiles(`${this.directory}/commands`);

        if (commands.length > 0) {
            log.info(
                'Boot',
                `${commands.length} commands discovered.`,
            );

            let commandCount = 0;

            for (const file of commands) {
                const command = require(file);

                if (command.enabled) {
                    if ('data' in command && 'execute' in command) {
                        const commandKeys = Array.from(client.commands.keys());
                        if(commandKeys.includes(command.data.name)) {
                            log.warn('Boot', `Conflicting commands names for ${command.data.name}. Overwriting with command from ${this.name}.`)
                        }
                        
                        client.commands.set(command.data.name, command);
                        client.jsonCommands.set(command.data.name, command.data.toJSON());
                        commandCount++;
                    }
                    else {
                        log.warn(
                            'Boot',
                            `The command at ${file} is missing required properties.`,
                        );
                    }
                }
            }

            log.success('Boot', `${commandCount} commands loaded.`);
        } else {
            log.info('Boot', `No commands found for ${this.shortname}. Proceeding.`);
            return [];
        }
    }

    getEvents(client) {
        if(!fs.existsSync(`${this.directory}/events`)) {
            log.info('Boot', `No events directory found for ${this.shortname}. Proceeding.`);
            return;
        }

        const events = utils.getAllFiles(`${this.directory}/events`);

        /* TODO: add event config check */

        if(events.length > 0) {
            log.info(
                'Boot',
                `${events.length} events discovered.`,
            );
            
            let eventCount = 0;

            for (const file of events) {
                const event = require(file);

                if(!client.events[event.name]) {
                    client.events[event.name] = [];
                }

                client.events[event.name].push(file);
                eventCount++;
            }

            log.success('Boot', `${eventCount} events loaded.`);
        } else {
            log.info('Boot', `No events found for ${this.shortname}. Proceeding.`);
            return;
        }
    }

    getJobs(client) {
        if(!fs.existsSync(`${this.directory}/jobs`)) {
            log.info('Boot', `No jobs directory found for ${this.shortname}. Proceeding.`);
            return;
        }

        const jobs = utils.getAllFiles(`${this.directory}/jobs`);

        if(jobs.length > 0) {

            log.info(
                'Boot',
                `${jobs.length} jobs discovered.`,
            );
            
            let jobCount = 0;

            for (const file of jobs) {
                const job = require(file);
                if (job.enabled) {
                    client.jobs.push(file);
                    jobCount++;
                }
            }
            log.success('Boot', `${jobCount} jobs loaded.`);
        } else {
            log.info('Boot', `No jobs found for ${this.shortname}. Proceeding.`);
            return;
        }
    }

    getMigrations(client) {
        if(!fs.existsSync(`${this.directory}/migrations`)) {
            log.info('Boot', `No migrations directory found for ${this.shortname}. Proceeding.`);
            return;
        }

        const migrations = utils.getAllFiles(`${this.directory}/migrations`);

        if(migrations.length > 0) {

            log.info(
                'Boot',
                `${migrations.length} migrations discovered.`,
            );
            
            let migrationCount = 0;

            for (const file of migrations) {
                client.migrations.push(file);
                migrationCount++;
            }
            log.success('Boot', `${migrationCount} migrations loaded.`);
        } else {
            log.info('Boot', `No migrations found for ${this.shortname}. Proceeding.`);
            return;
        }
    }

    async setShortName(name) {
        this.shortname = name;
    }
}