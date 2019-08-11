// jshint esversion:6, asi: true, laxcomma: true

const { ipcRenderer, shell } = require('electron')

const path = localStorage.path ? localStorage.path : ''

const repo = require('fs-jetpack').dir(path, {})



const codes = {
	find: ['KeyF'],
	exit: ['KeyW'],
	restart: ['KeyR'],
	close: ['Escape'],
	settings: ['KeyS', 'KeyN'],
}

const dom = {
	
	body: document.querySelector('body'),
	filter: document.querySelector('.filter'),
	container: document.querySelector('.container'),
	details: document.querySelector('reapo-details'),
	menu: document.querySelector('reapo-menu'),
	settings: document.querySelector('reapo-settings'),
	footer: document.querySelector('footer'),
	refreshReapo: document.querySelector('.refreshReapo'),
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

	if(storage !== 'object'){ 
		localStorage.setItem('theme', JSON.stringify(theme))
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
	dom.body.addEventListener('toast', e => {

		toast(e.detail.msg)

		if(typeof e.detail.res == 'function'){
			//res('toasted')
		}
	})

	dom.body.onkeyup = e => { //console.log(e.code+e.ctrlKey)
		
		/* Close overlay on Esc press */
		codes.close.includes(e.code) ? [dom.settings, dom.details].map(el => el.close()) : null // jshint ignore: line

		/* Close Reapo on Ctrl+W press */
		e.ctrlKey && codes.exit.includes(e.code) ? quit() : null // jshint ignore: line

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

{ /* Repo Details */

	/* Opener */
	dom.container.addEventListener('open-details', e => dom.details.open(e.detail))
	
	/* Exec CMDs for User */
	dom.details.addEventListener('exec-cmd', e => execEvent(e))

	/* Delete Repo */
	dom.details.addEventListener('delete-repo', e => {
		
		const name = e.detail.name
		const path = localStorage.path
		//const chain = e.detail.res
		const cmd = `rm -Rf ${path}${name}`
		
		exec(cmd)

		loadRepo({ clear: true })
		//toast(x.stderr || x.stdout)
		dom.details.close()
	})

	/* Archive Repo */
	dom.details.addEventListener('archive', Archive)

	/* open-directory */
	dom.details.addEventListener('open-directory', event => {
		
		const { folder } = event.detail
		
		const filepath = `${path}${folder}/.`

		shell.showItemInFolder( filepath )
	})

	/* refresh-directory */
	dom.refreshReapo.onclick = () => {
		loadRepo({ clear: true })
		toast(`Refreshed directory 🦄`)
	}


	/* Git Link Repo */
	dom.details.addEventListener('gitlink', e => {
		
		const cmd = 'git remote -v'

		const responder = data => {

			const check = data.indexOf('.git') > 0
			const check2 = data.indexOf('http') > 0
			
			if(check){

				const url = data.substring(data.indexOf('https'), data.indexOf('.git')+4)
				
				shell.openExternal(url)
			}
			else if(check2) {
				
				const raw = data.substring(data.indexOf('http') , data.length)
				const url = raw.substring(0, raw.indexOf(' '))
				
				shell.openExternal(url)

			}
			else {
				toast(`😕 ${data.substring(0, 250)}...`)
			}
		}
		
		exec(cmd, e.detail.cwd, responder)
	})
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
	dom.settings.addEventListener('new-repo', newRepo)


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

function execEvent(event){

	const { cmd, cwd, responder, exit } = event.detail

	exec(cmd, cwd, responder, exit)
}

/* Exec on behalf of user */
function exec(cmd, cwd, responder, exit){

	//console.log(`${cmd} ${cwd} ${responder} ${exit}`)

	const exec = require('child_process').exec
	const command = cwd ? exec(cmd, { cwd }) : exec(cmd)

	if(typeof responder === 'function'){
		command.stdout.on('data', data => responder(data.toString()))
		command.stderr.on('data', data => responder(data.toString()))
	}
	
	command.on('exit', code => exit ? exit(`Process finished with exit code ${code.toString()}`) : responder ? responder('exit') : null) // code.toString()
}


/**
 * @description ZIP directory then offer to delete original | 
 * 				Toast response
 * @param {Event} e 
 */
async function Archive(e){

	const Archiver = require(__dirname+'/scripts/archieve')
	
	//delete node_package? might not have deps listed, maybe option later in settings #todo #idea
	//console.dir(Archiver.directory)
	//run thru handleRepo
	try {

		const msg = await Archiver.directory(e.detail, toast)

		dom.details.close()
		toast(msg)
		// Ask to Delete repo after toasting success msg
		setTimeout(() => dom.details.dom.remove.click(), 1500)
	}
	catch(error){
		toast(error)
	}
}


const closeRepo = require('electron').remote.getCurrentWindow().close

/* IPC Commms */
function quit() {

	closeRepo()
}


function newRepo(event) {

	const { responder, exit } = event.detail
	
	ipcRenderer.send('mk-dir', event.detail)

	ipcRenderer.on('mk-dir-res', (event, msg) => {
		
		responder()
		exit(msg)
	})
}


{ /* Open in VS Code */

	const openVsCode = event => {

		ipcRenderer.send('vs-code', event.detail)
		ipcRenderer.on('vs-code', (event, result) => {
			
			toast(`Opened ${e.detail.title} in VS Code 🦄`)
		})
	}

	dom.container.addEventListener('open-code', openVsCode)
	dom.settings.addEventListener('open-code', openVsCode)
	dom.details.addEventListener('open-code', (e) => openVsCode(e))
}
