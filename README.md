<div align="center">
	<p>
		<img src="https://raw.githubusercontent.com/alexriley1223/bishop/rework/static/bishopbanner.png" alt="Bishop Discord Bot" />
	</p>
	<br />
	<p>
		<img src="https://img.shields.io/github/license/alexriley1223/bishop" />
		<img src="https://img.shields.io/github/v/tag/alexriley1223/bishop"/>
		<img src="https://img.shields.io/badge/Node.js->=v16.11-green" />
		<img src="https://img.shields.io/badge/Discord.js-v14-blue" />
	</p>
</div>

## Bishop
<b>Bishop</b> is an extendable, self-hosted Discord bot written with the Discord.js library. You can:
- Get a customized, fast Discord bot up in a matter of minutes
- Create new Bishop packages, allowing you to interface with:
  - Native Discord events and custom package events
  - System CRON jobs
  - Commands with no restrictions
  - Databasing, from flatfiles to hosted solutions

### Installation
1. Clone the package to your server or locally
  ``git clone https://github.com/alexriley1223/bishop.git``

2. Or download the .zip provided by GitHub.
  ``https://github.com/alexriley1223/bishop/archive/refs/heads/master.zip``

3. Install the required dependencies
  ``npm install``

4. Set up any configuration files. This may include moving *_template.json files to their base form and filling in entries.

5. Run Bishop
  ``npm run start:prod``

### Officially Supported Packages
- <a href="https://github.com/alexriley1223/bishop-radio">Bishop Radio</a>
- <a href="https://github.com/alexriley1223/bishop-points">Bishop Points (TBA)</a>

### Installing Packages
Clone or download the .zip of the package. Place the package folder inside the modules directory. Configure any options and restart Bishop - make sure the module enabled attribute is set to `true`. Re-run `npm install` upon installation of any new packages.
### Issues
This repository is actively maintained by me. If you run into any issues, feel free to <a href="https://github.com/alexriley1223/bishop/issues/new">create a new issue here</a>.
