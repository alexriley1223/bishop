module.exports = (client) => {
	client.bishop.jobs.forEach(function(job) {
		const moduleJob = require(job);
		moduleJob.execute(client);
	});
};
