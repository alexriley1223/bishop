const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
	const files = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || [];

	files.forEach(function(file) {
		if (fs.statSync(dirPath + '/' + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
		}
		else {
			arrayOfFiles.push(path.join(dirPath, '/', file));
		}
	});

	return arrayOfFiles;
}

/* Inject Module Events */
function fireModuleEvents(client, eventName) {
	if (client.bishop?.events[eventName]) {
		client.bishop.events[eventName].forEach((event) => {
			require(`../${event}`)(client);
		});
	}
	return true;
}

module.exports = {
	getAllFiles,
	fireModuleEvents,
};
