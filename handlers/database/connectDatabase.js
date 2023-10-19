module.exports = (client) => {
	try {
		client.bishop.db.authenticate();
	}
	catch (error) {
		client.bishop.logger.error(
			'Boot',
			'Failed to connect or configure database. Please check your configuration.',
		);
	}
};
