const chalk = require('chalk');

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
		return console.error(
			`[${chalk.bold.bgRed('ERRO')}][${type.toUpperCase()}][${chalk.dim(this.timestamp)}]: ${err}`,
		);
	}

	warn(type, warning) {
		return console.warn(
			chalk.underline(
				`[${chalk.bold.yellowBright('WARN')}][${type.toUpperCase()}][${chalk.dim(
					this.timestamp,
				)}]: ${warning}`,
			),
		);
	}

	info(type, content) {
		return console.log(
			`[${chalk.blueBright('INFO')}][${type.toUpperCase()}][${chalk.dim(
				this.timestamp,
			)}]: ${content}`,
		);
	}

	success(type, content) {
		return console.log(
			`[${chalk.greenBright('SUCC')}][${type.toUpperCase()}][${chalk.dim(
				this.timestamp,
			)}]: ${content}`,
		);
	}

	debug(type, content) {
		return console.log(
			`[${chalk.bgMagenta('DEBUG')}][${type.toUpperCase()}][${chalk.dim(
				this.timestamp,
			)}]: ${content}`,
		);
	}
}

module.exports = new Logger();
