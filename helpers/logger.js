class Logger {
	get timestamp() {
		return Intl.DateTimeFormat('en-US', {
			minute: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			month: '2-digit',
			year: 'numeric',
			second: '2-digit',
		}).format(Date.now());
	}

	error(type, error) {
		const err = error instanceof Error ? error.message : error;
		return console.error(`[ERRO][${type.toUpperCase()}][${this.timestamp}]: ${err}`);
	}

	warn(type, warning) {
		return console.warn(`[WARN][${type.toUpperCase()}][${this.timestamp}]: ${warning}`);
	}

	info(type, content) {
		return console.log(`[INFO][${type.toUpperCase()}][${this.timestamp}]: ${content}`);
	}

	debug(type, content) {
		return console.log(`[DEBUG][${type.toUpperCase()}][${this.timestamp}]: ${content}`);
	}
}

module.exports = new Logger();
