// Please refactor this awful mess
// Only used for dev testing but still
// Register aliases
require('module-alias/register');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('@config/bot.json');

var commands = [];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {

    var commandList = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    commandList.forEach(function(command){
      commands.push(command.id);
    });

  } catch (error) {
    console.error(error);
  } finally {
    commands.forEach(function(command){
      try {
        console.log(`Attempting to unregister command ${command}`);
        rest.delete(Routes.applicationGuildCommand(clientId, guildId, command)).then(function(res){
          console.log(`Successfully unregistered command ${command}`);
        });

      } catch (error) {
        console.error(error);
      }
    });
  }
})();
