const fs = require('fs');

module.exports = async (client) => {
    client.bishop.logger.success('BOOT', 'Initializing modules.');

    let modules = fs.readdirSync(`${__dirname}/../modules`, { withFileTypes: true }).map(mod => mod.name);

    modules = client.generateModuleLoadOrder(modules);

    modules.forEach(module => {
        if (!fs.existsSync(`${__dirname}/../modules/${module}/module.js`)) {
            client.bishop.logger.warn('BOOT', `Unable to find new instance for ${module}. Please ensure it is following the proper naming convention.`);
            return;
        }

        const modFile = require(`${__dirname}/../modules/${module}/module`)(client);
        if(modFile.enabled) {
            modFile.setShortName(module);
            client.bishop.logger.success('BOOT', `Initializing ${modFile.name} (v${modFile.version}) by ${modFile.author} - ${modFile.description}`)

            /* Add to module collection - incrementing index to hold load order */
            client.bishop.modules.set((client.bishop.modules.size > 0) ? client.bishop.modules.size - 1 : 0, modFile);
            
            /* Initialize Module & pull commands, jobs, events, and migrations */
            modFile.init();
            modFile.getCommands(client.bishop);
            modFile.getEvents(client.bishop);
            modFile.getJobs(client.bishop);
            modFile.getMigrations(client.bishop);
        }
    });
}