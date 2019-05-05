// jshint esversion:6, asi: true, laxcomma: true

const path = require('path')
const icon = path.resolve(`${__dirname}/assets/icons/png/icon.icns`)

module.exports = {

	packagerConfig: {
		icon,
		packageManager: 'npm', 
	},
	github_repository: {
		owner: 'jsmithdev',
		name: 'reapo',
		prerelease: true
	},
	makers: [{
		name: '@electron-forge/maker-squirrel',
	},
	{
		name: '@electron-forge/maker-zip',
		platforms: [
			'darwin'
		]
	},
	{
		name: '@electron-forge/maker-deb',
		config: { }
	},
	{
		name: '@electron-forge/maker-rpm',
		config: {}
	}
	]
}