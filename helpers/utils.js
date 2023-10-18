const fs = require('fs');
const path = require('path');

/* Get full path to file from directory to directory - used for modules (database, commands, etc.) to get subdirectories */
function getParentDirectoryString(file, dir, type = 'commands') {
	const dirString = [];
	const explodeDir = dir.split('/');

	while (explodeDir[explodeDir.length - 1] != type) {
		dirString.push(explodeDir.pop());
	}

	if (dirString.length == 0) {
		return path.parse(file).base;
	}
	else {
		dirString.push(path.parse(file).base);
		return dirString.join('/');
	}
}

/* Recursively get all files and files in subdirectories given a path */
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

/* Compare two arrays, regardless of type and order */
function equals(a, b) {
	if (a.length !== b.length) {
		return false;
	}

	const seen = {};
	a.forEach(function(v) {
		const key = typeof v + v;
		if (!seen[key]) {
			seen[key] = 0;
		}
		seen[key] += 1;
	});

	return b.every(function(v) {
		const key = typeof v + v;
		if (seen[key]) {
			seen[key] -= 1;
			return true;
		}
	});
}

/* Inject module events */
function fireModuleEvents(client, eventName, ...params) {
	if (client.bishop.events && client.bishop.events[eventName]) {
		client.bishop.events[eventName].forEach((event) => {
			require(`../${event}`)(client, params);
		});
	}
	return true;
}

/* Remove extra whitespace at the end of retrieved file content */
function removeExtraLine(arr) {
	if (arr[arr.length - 1] == '') {
		arr.pop();
	}

	return arr;
}

module.exports = {
	getParentDirectoryString,
	getAllFiles,
	equals,
	fireModuleEvents,
	removeExtraLine
};
