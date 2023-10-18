module.exports = (client, params) => {
	client.channels.cache
		.get('906377148401606720')
		.send(`${params[0].user.username} has left the server :saluting_face:`);
};
