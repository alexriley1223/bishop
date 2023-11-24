require('module-alias/register');
const { timezone } = require('@config/bot.json');

const BishopClient = require('@classes/BishopClient');
const client = new BishopClient();

process.env.TZ = timezone;

client.boot();

module.exports = client;
