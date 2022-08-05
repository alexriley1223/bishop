<div align="center">
	<br />
	<p>
		<img src="https://git.alexriley.me/repo-avatars/12-5bf0c8fdfc11c47e193cd60a18a1a7b7" width="250" alt="Bishop Discord Bot" />
	</p>
	<p>
		<img src="https://img.shields.io/discord/604872185391087629?style=for-the-badge" alt="DEX Discord Server" />
</div>

## About
Bishop is an all-in-one, self hosted Discord bot for developers and tinkerers. Built using <a href="https://discord.js.org/">discord.js</a>, Bishop is easily expandable to suite your server's needs.
## Features
- Dynamic and expandable command, event, database, and job system
- Radio streams from YouTube
- Points system based on user engagement with your server
- Full Discord API coverage with usage of discord.js

### Modules
**These are the modules available out of the box with Bishop**
- General: Generic server commands
- Lol: League of legends specific commands
- Points: A dynamic user points system
- Radio: YouTube stream radio with play/pause/queueing
- Util: More generic server commands, more Admin focused

## Installation
**Requires Node.js >= 16.9.0**

### Acquire packages
```sh-session
npm install
```
<br>

### Populate all config files in config/*
<br>

**api.json**
```
API Tokens

{
  "lolDevToken": "RGAPI-12345", // LoL API Token if using LoL API
  "alphaToken": "1M5AHBO6OVB15SRW" // Alpha token if using stock game
}
```
**bot.json**
```
Bot specific information

{
  "clientId": "Your Bot Client ID",
  "guildId": "Your Guild ID",
  "token": "Bot Token/Secret",
  "color": "#FFFFFF", // Color to use for Bot Embeds / Global
  "name": "Bishop" // Name of your Bot
}
```
**channels.json**
```
Channel IDs of associated channels

{
  "musicChannelId": "12345", // Radio updates
  "gameUpdatesChannelId": "12345", // Points game updates
  "announcementsChannelId": "12345", // Server announcements
  "afkChannelId": "12345", // AFK Channel
  "botUpdatesChannel": "12345" // Bot updates
}
```
**modules.json**
```
Which modules to have enabled

{
  "general": true,
  "lol": true,
  "points": true,
  "radio": true,
  "util": true
}
```
**roles.json**
```
List of roles and point thresholds for point-acquired server ranks. Populate as needed

"roles": [
    { "tier": Order, "id": "RoleId", "amount": minimumPoints },
    { "tier": 2, "id": "12345", "amount": 200 },
  ]
```
### Deploy
```sh-session
node deploy-commands.js
node initialize-database.js
node app.js
```

## Prepare for Deployment
If you have two bots (one production, one development), run the command below to unregister commands from the development bot.

```bash
  node unregister-commands.js
```
