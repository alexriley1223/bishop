const semver = require('semver');
const fs = require('fs');
const log = require('@helpers/logger');
const { color } = require('@config/bot');
const { version } = require('../package.json');
const axios = require('axios');
const chalk = require('chalk');

module.exports = async function() {
	/* Bishop ASCII */
	console.log('\n');
	console.log(
		chalk
			.hex(color)
			.bold(
				`\u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2584   \u2584\u2588     \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588    \u2584\u2588    \u2588\u2584     \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2584     \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2584 \r\n  \u2588\u2588\u2588    \u2588\u2588\u2588 \u2588\u2588\u2588    \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588 \r\n  \u2588\u2588\u2588    \u2588\u2588\u2588 \u2588\u2588\u2588\u258C   \u2588\u2588\u2588    \u2588\u2580    \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588 \r\n \u2584\u2588\u2588\u2588\u2584\u2584\u2584\u2588\u2588\u2580  \u2588\u2588\u2588\u258C   \u2588\u2588\u2588         \u2584\u2588\u2588\u2588\u2584\u2584\u2584\u2584\u2588\u2588\u2588\u2584\u2584 \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588 \r\n\u2580\u2580\u2588\u2588\u2588\u2580\u2580\u2580\u2588\u2588\u2584  \u2588\u2588\u2588\u258C \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2580\u2580\u2588\u2588\u2588\u2580\u2580\u2580\u2580\u2588\u2588\u2588\u2580  \u2588\u2588\u2588    \u2588\u2588\u2588 \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580  \r\n  \u2588\u2588\u2588    \u2588\u2588\u2584 \u2588\u2588\u2588           \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588        \r\n  \u2588\u2588\u2588    \u2588\u2588\u2588 \u2588\u2588\u2588     \u2584\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588    \u2588\u2588\u2588   \u2588\u2588\u2588        \r\n\u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580  \u2588\u2580    \u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2580    \u2588\u2588\u2588    \u2588\u2580     \u2580\u2588\u2588\u2588\u2588\u2588\u2588\u2580   \u2584\u2588\u2588\u2588\u2588\u2580      v${version}\r\n                                                                      `,
			),
	);
	console.log('\n');

	/* Check valid Node version */
	if (!semver.satisfies(process.versions.node, '>=16.9.0')) {
		throw Error(
			`Bishop requires Node.js version >=16.9.0. You are using v${process.versions.node}. Please upgrade to continue.`,
		);
	}
	else {
		log.success('BOOT', `Node version is correct (${process.versions.node}).`);
	}

	/* Check Bishop Version */
	await axios
		.get('https://api.github.com/repos/alexriley1223/bishop/tags')
		.then((res) => {
			const versions = res.data.sort((v1, v2) => semver.compare(v2.name, v1.name));
			if (versions[0].name != `v${version}`) {
				log.warn(
					'BOOT',
					`Bot is not the latest version. ${
						semver.gt(`v${version}`, versions[0].name)
							? 'Beta version in use. Proceed with caution!'
							: `Please update! Yours: v${version} - Latest: ${versions[0].name}`
					}`,
				);
			}
		})
		.catch(() => {
			log.warn('BOOT', 'Unable to fetch latest bot version. Proceed with caution!');
		});

	/* Check all root configs exist and required fields exist */
	const configs = ['bot.json', 'database.json'];

	/* config file structure with required fields */
	const requiredFields = {
		'bot.json': ['clientId', 'guildId', 'token', 'color', 'name'],
		'database.json': [
			'useDatabase',
			'useBackupJob',
			'driver',
			'host',
			'database',
			'name',
			'username',
			'password',
			'logging',
			'port',
		],
	};

	/* check if config required fields exist and are not empty */
	configs.forEach((e) => {
		if (fs.existsSync(`./config/${e}`)) {
			log.success('BOOT', `${e} config file exists.`);

			/* Check if required fields exist */
			const moduleJson = JSON.parse(fs.readFileSync(`./config/${e}`, 'utf8'));

			Object.keys(moduleJson).forEach(function(prop) {
				if (moduleJson[prop].length == 0) {
					throw Error(
						`Missing required config value [${prop}] in ${e}. Please update or add this value.`,
					);
				}

				if (requiredFields[e].includes(prop)) {
					requiredFields[e].splice(requiredFields[e].indexOf(prop), 1);
				}
			});

			if (requiredFields[e].length > 0) {
				throw Error(
					`Missing required config value(s) [${requiredFields[e].join(
						', ',
					)}] in ${e}. Please update or add this value.`,
				);
			}
			else {
				log.success('BOOT', `${e} is populated and has all values.`);
			}
		}
		else {
			throw Error(`Missing required config file ${e}. Please ensure this file exists.`);
		}
	});
};
