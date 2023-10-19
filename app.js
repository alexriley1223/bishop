require('module-alias/register');

const BishopClient = require('@classes/BishopClient');
const client = new BishopClient();

client.boot();

module.exports = client;
