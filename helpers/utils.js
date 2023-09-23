const fs = require('fs');
const path = require('path');

function getParentDirectoryString(file, dir) {
	let dirString = [];
	let explodeDir = dir.split("/");
	
	while(explodeDir[explodeDir.length - 1] != 'commands') {
		dirString.push(explodeDir.pop());
	}

	if(dirString.length == 0) {
		return path.parse(file).base;
	} else {
		dirString.push(path.parse(file).base);
		return dirString.join('/');
	}
}

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
	getParentDirectoryString,
	getAllFiles,
	fireModuleEvents,
};
