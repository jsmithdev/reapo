// jshint esversion:6, asi: true, laxcomma: true

require('./components/reapo-menu/reapo-menu.js')
require('./components/reapo-details/reapo-details.js')
require('./components/reapo-folder/reapo-folder.js')
require('./components/reapo-settings/reapo-settings.js')

const fs = require('fs')
	, util = require('util')
	, exec = util.promisify(require('child_process').exec)
	, path = localStorage.path ? localStorage.path : ''
    , repo = require('fs-jetpack').dir(path, {})
    , codes = {
	    find: ['KeyF'],
	    close: ['Escape'],
	    exit: ['KeyW'],
	    restart: ['KeyR'],
	    settings: ['KeyS'],
    };


const dom = {
	
	body: document.querySelector('body'),
	filter: document.querySelector('.filter'),
	container: document.querySelector('.container'),
	modal: document.querySelector('reapo-details'),
	menu: document.querySelector('reapo-menu'),
	settings: document.querySelector('reapo-settings'),
	footer: document.querySelector('footer'),
}

/* Toaster */
const toast = msg => {

	dom.footer.textContent = msg
	setTimeout(() => dom.footer.textContent = '', 5000)
}

/* Load Main Directory View */
const loadRepo = (config) => { // init repo

	if (config.clear) {
		while (dom.container.lastChild) {
			dom.container.removeChild(dom.container.lastChild)
		}
	}

	const projects = repo.list().map(name => repo.inspect(`${path}/${name}`, { times: true }))

	const add = dir => {
		if(!dir){toast('Use Settings to set a Main Directory');return;}
		const folder = document.createElement('reapo-folder')
		folder.path = repo.cwd()
		folder.name = dir.name
		folder.date = dir.modifyTime

		dom.container.appendChild(folder)
	}
	//console.dir(projects)
	projects.map(add)

	// give some empty space #todo do better
	Array.from(Array(4).keys()).map(() => dom.container.appendChild(document.createElement('div')))
}
loadRepo({ clear: true })


{ /* Global Listeners, hotkey bubble ups => gotta catch em all */
	
	/* Toaster */
	dom.body.addEventListener('toast', (e) => {

		toast(e.detail.msg)

		if(typeof e.detail.res == 'function'){
			res('toasted')
		}
	})

	dom.body.onkeyup = e => { //console.log(e.code+e.ctrlKey)
		
		/* Close overlay on Esc press */
		codes.close.includes(e.code) ? [dom.settings, dom.modal].map(el => el.close()) : null // jshint ignore: line

		/* Close Reapo on Ctrl+W press */
		e.ctrlKey && codes.exit.includes(e.code) ? require('electron').remote.getCurrentWindow().close() : null // jshint ignore: line

		/* Restart Reapo on Ctrl+R hotkey */
		e.ctrlKey && codes.restart.includes(e.code) ? restart() : null // jshint ignore: line

		/* Focus filter of Ctrl+F overlay on Esc press hotkey */
		e.ctrlKey && codes.find.includes(e.code) ? dom.filter.focus() : null // jshint ignore: line

		/* Open Settings hotkey */
		e.ctrlKey && codes.settings.includes(e.code) ? dom.settings.open() : null // jshint ignore: line
	}
}

{ /* Filtering */
	dom.filter.addEventListener('keyup', e =>
		dom.container.childNodes.forEach(el => {
			if (el.title) { el.style.display = el.title.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none' }
		})
	)
}

{ /* Repo Details / Modal */

	/* Opener */
	dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))
	
	/* Exec CMDs for User */
	dom.modal.addEventListener('exec-cmd', e => {
		
		const { cmd, cwd, chain } = e.detail
		
		exec(cmd, { cwd })
		.then(x => chain.res(x.stderr || x.stdout))
		.catch(e => chain.rej(e))
	})

	/* Delete Repo */
	dom.modal.addEventListener('delete-repo', e => {
		
		const name = e.detail.name
		const path = localStorage.path
		const chain = e.detail.res

		const cmd = `rm -Rf ${path}${name}`

		exec(cmd, { cwd: path })
		.then(x => {
			loadRepo({ clear: true })
			toast(x.stderr || x.stdout)
			dom.modal.close()
		})
	})

	/* Archive Repo */
	dom.modal.addEventListener('archive', e => {
		
		const Archiver = require(__dirname+'/scripts/archieve')
		
		//delete node_package? might not have deps listed, maybe option later in settings #idea
		console.dir(Archiver.directory)
		//run thru handleRepo
		Archiver.directory(e.detail, toast)
		.then(msg => {
			dom.modal.close()
			toast(msg)
			// Ask to Delete repo after toasting success msg
			setTimeout(() => dom.modal.dom.remove.click(), 1500)
		})
		.catch(x => toast(x))
	})
}

{ /* Folders */
	
	/* Opener */
	dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))
	
	/* Open in VS Code */
	const code = e =>   exec(e.detail.cmd, { cwd: e.detail.cwd })
						.then((ev, resp) => {
							toast(`Opened ${e.detail.title} in VS Code 🦄`)
							e.detail.res(resp, ev)
						})
	dom.container.addEventListener('open-code', e => code(e))
	dom.settings.addEventListener('open-code', e => code(e))
}



{ /* Settings Menu */

	/* Opener */
	dom.menu.onclick = () => dom.settings.open()

	/* Save Main Settings */
	dom.settings.addEventListener('save-settings', (e) => {
        
		const path = e.detail.path
		const msg = `Saved ${path}`

        localStorage.path = path
		toast(msg)
        loadRepo({ clear: true })
        e.detail.res(msg)
	})

	/* New blank Repo */
	dom.settings.addEventListener('new-repo', (e) => {

		const name = e.detail.name
		const path = `${localStorage.path}/${name}`
		const chain = e.detail.res


		fs.mkdir(path, { recursive: true }, (err) => {
			if (err) throw err;

			loadRepo({})
			
			exec('code .', { cwd: path })
			.then(x => chain(`Created ${name} in ${path}`, x))
		})
	})

	/* New git clone */
	dom.settings.addEventListener('new-git', (e) => {

		const git = e.detail.name
		const path = localStorage.path
		const chain = e.detail.res

		exec(`git clone ${git}`, { cwd: path })
		.then(x => chain(x.stderr || x.stdout, x))
	})

	/* New sfdx project */
	dom.settings.addEventListener('new-sfdx', (e) => {

		const name = e.detail.name
		const cwd = localStorage.path
		const chain = e.detail.res
		
		exec(`sfdx force:project:create --projectname ${name}`, { cwd })
		.then(x => chain(x.stderr || x.stdout, x))
		.catch(x => chain(x.stderr || x.stdout, x))
	})

	/* Refresh Repos */
	dom.settings.addEventListener('refresh-repo', (e) => {
		loadRepo({ clear: true })
	})
}

function restart(){
	const app = require('electron').remote.app
	app.relaunch()
	app.exit(0)
}

/* Help for unix PATH vars so reapo can run installed cli's on behalf of user */
if (process.platform !== 'windows') {

	const shellPath = require('shell-path')
	process.env.PATH = shellPath.sync() || [
		'./node_modules/.bin',
		'/.nodebrew/current/bin',
		'/usr/local/bin',
		process.env.PATH
	].join(':')
}