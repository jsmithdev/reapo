// jshint esversion:6, asi: true, laxcomma: true

require('./components/reapo-menu/reapo-menu.js')
require('./components/reapo-details/reapo-details.js')
require('./components/reapo-folder/reapo-folder.js')
require('./components/reapo-settings/reapo-settings.js')
require('./components/reapo-theme/reapo-theme.js')
require('./components/color-picker/color-picker.js')

const fs = require('fs')
	, path = localStorage.path ? localStorage.path : ''
	, repo = require('fs-jetpack').dir(path, {})
	, codes = {
		find: ['KeyF'],
		close: ['Escape'],
		exit: ['KeyW'],
		restart: ['KeyR'],
		settings: ['KeyS', 'KeyN'],
	}

const dom = {
	
	body: document.querySelector('body'),
	filter: document.querySelector('.filter'),
	container: document.querySelector('.container'),
	modal: document.querySelector('reapo-details'),
	menu: document.querySelector('reapo-menu'),
	settings: document.querySelector('reapo-settings'),
	footer: document.querySelector('footer'),
	themeButton: document.querySelector('.themeContainer'),
	themer: document.querySelector('reapo-theme'),
}


{	// Handle Theming
	const setTheme = theme => {	
		for (const key in theme){
			document.documentElement.style.setProperty(key, theme[key])
		}
	}

	// Get custom theme
	const storage = localStorage.getItem('theme')
	const data =  storage ? JSON.parse(storage) : null

	// If theme is set use it else use default theme and set it
	const theme = data === 'object' ? data : {
		'--color-lightest': '#EEE',
		'--color-accent': '#00e6ff',
		'--color-light': '#ec00ff',
		'--color-mid': '#4f23d7',
		'--color-dark': '#011627',
		'--color-highlight': '#ffd70e',
		'--shadow-drop': 'drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.5))',
		'--shadow-top': '0px 2px 4px 0 rgba(0, 0, 0, 0.2), 0px -4px 10px 0px rgba(0, 0, 0, 0.2)',
	}



	setTheme(theme)

	if(storage !== 'object'){ localStorage.setItem('theme', JSON.stringify(theme)) }
	console.dir(dom.themer)
	dom.themeButton.onclick = () => {
		dom.themer.open()
	}
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
		
		if (!dir) { toast('Use Settings to set a Main Directory'); return }

		const folder = document.createElement('reapo-folder')

		folder.path = repo.cwd()
		folder.name = dir.name
		folder.date = dir.modifyTime

		dom.container.appendChild(folder)
	}
	
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
			//res('toasted')
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
	dom.modal.addEventListener('exec-cmd', e => execEvent(e))

	/* Delete Repo */
	dom.modal.addEventListener('delete-repo', e => {
		
		const name = e.detail.name
		const path = localStorage.path
		//const chain = e.detail.res
		const cmd = `rm -Rf ${path}${name}`
		
		exec(cmd)

		loadRepo({ clear: true })
		//toast(x.stderr || x.stdout)
		dom.modal.close()
	})

	/* Archive Repo */
	dom.modal.addEventListener('archive', e => {
		
		const Archiver = require(__dirname+'/scripts/archieve')
		
		//delete node_package? might not have deps listed, maybe option later in settings #todo #idea
		//console.dir(Archiver.directory)
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
	const code = e => exec(e.detail.cmd, e.detail.cwd, null, () => toast(`Opened ${e.detail.title} in VS Code 🦄`))
	
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

		const { name, cmd, cwd, responder, exit } = e.detail

		const path = `${cwd}/${name}`

		fs.mkdir(path, { recursive: true }, (err) => {
			
			if (err) throw err

			loadRepo({clear: true})
			
			exec(cmd, path, responder, exit)
		})
	})

	/* New git clone */
	dom.settings.addEventListener('new-git', (e) => execEvent(e))

	/* New sfdx project */
	dom.settings.addEventListener('new-sfdx', e => execEvent(e))

	/* Refresh Repos */
	dom.settings.addEventListener('refresh-repo', () => loadRepo({ clear: true }))
}

function restart(){

	const app = require('electron').remote.app
	app.relaunch()
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

function execEvent(e){

	const { cmd, cwd, responder, exit } = e.detail

	exec(cmd, cwd, responder, exit)
}

/* Exec on behalf of user */
function exec(cmd, cwd, responder, exit){

	//console.log('Exec on behalf of user')
	//console.log(`${cmd} ${cwd} ${responder} ${exit}`)

	const exec = require('child_process').exec
	const command = cwd ? exec(cmd, { cwd }) : exec(cmd)

	if(typeof responder === 'function'){
		command.stdout.on('data', data => responder(data.toString()))
		command.stderr.on('data', data => responder(data.toString()))
	}
	
	command.on('exit', code => exit ? exit(`Process finished with exit code ${code.toString()}`) : responder ? responder('exit') : null) // code.toString()
}
