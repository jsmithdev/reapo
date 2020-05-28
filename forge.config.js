
const path = require('path')
const icon = path.resolve(`${__dirname}/assets/icons/png/icon.png`)

module.exports = {

	packagerConfig: {
		icon,
		license: 'MIT',
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
		config: {
			icon,
			productName: 'Reapo',
			license: 'MIT',
			maintainer: 'Jamie Smith',
			homepage: 'https://github.com/jsmithdev/reapo',
			categories: ['Development']
		}
	}],
	publishers: {
		name: '@electron-forge/publisher-github',
		platforms: ['deb'],
		config: {
			repository: {
				owner: 'jsmithdev',
				name: 'reapo'
			},
			authToken: '',
			prerelease: true
		}
	}
}


/* 
,
	{
		name: '@electron-forge/maker-rpm',
		config: {}
	}

	
	{
		name: '@electron-forge/maker-snap',
		config: {
			features: {
			audio: false,
			mpris: 'com.reapo.mpris',
			webgl: false
			},
			summary: 'Repo manager built with web standards'
	}
},
*/