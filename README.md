
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

Sync deploy commands

```bash
  node deploy-commands.js
```

Run Client
```bash
  node app.js
```

This will be made cleaner in the future.


## Usage/Examples

### End-User commands in Discord

Display badge with LoL summoner information. Currently only supports NA1.
```bash
  /lolprofile :name
```

Display badge about a summoner's current game. Currently only supports NA1.
```bash
  /lolingame :name
```
