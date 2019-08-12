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
		config: {
			productName: "Reapo",
			maintainer: "Jamie Smith",
			homepage: "https://github.com/jsmithdev/reapo",
			icon: "resources/icon.png",
			categories: ['Development']
		}
	}],
	publishers: {
		name: '@electron-forge/publisher-github',
		config: {
		  repository: {
			owner: 'jsmithdev',
			name: 'reapo'
		  },
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