
# DEX Node Discord Bot

Discord bot for testing API integrations with Discord's API for the https://d3x.me/ Discord server.


## Config Variables

To run this project, you will need to add the following environment variables to your config.json file

`clientId` - Bot User ID

`guildId` - Server ID

`token` - Discord Bot Secret

`lolDevToken` - If using LoL API


## Run Locally

Install dependencies

```bash
  npm install
```

Create database tables on first initialization of bot
```bash
  node initialize-database.js
```

Sync deploy commands
```bash
  node deploy-commands.js
```

Run Client
```bash
  node app.js
```

This will be made cleaner in the future.
