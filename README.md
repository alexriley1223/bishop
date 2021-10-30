
# Bishop Discord Bot
Feature-packed discord bot for the https://d3x.me/ Discord server.

## Config Variables
To run this project, you will need to add the following environment variables to your configi/xxxxxx.json files

**api.json**
`lolDevToken` - If using LoL API

**bot.json**
`clientId` - Bot User ID

`guildId` - Server ID

`token` - Discord Bot Secret

`color` - Color to use for embedded messages

**channels.json**
`musicChannelId` - ID of channel to funnel all music commands through

`gameUpdatesChannelId` - ID of channel to post casino/game updates to

`announcementsChannelId` - ID of channel for general announcements

`afkChannelId` - ID of AFK channel


## Run Locally

Run the included upgrade command
```bash
  npm run upgrade
```

Run Client
```bash
  node app.js
```

## Prepare for Deployment
If you have two bots (one production, one development), run the command below to unregister commands from the development bot.

```bash
  node unregister-commands.js
```
