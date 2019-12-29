
const { ipcRenderer, remote, shell, app } = require('electron')

const Path = localStorage.path ? localStorage.path : __dirname

const Repo = require('fs-jetpack').dir(Path, {})


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
	sortDir: document.querySelector('reapo-sort'),
	header: document.querySelector('reapo-header'),
}

if (!Path) {
	toast('Use Settings to set a Main Directory')
}
else {
	loadRepo({ 
		clear: false,
		order: localStorage.getItem('order'),
	})
}

// todo module off all theming to separate 
{// Theming 

	// Default Theme
	const defaults = {
		'--color-lightest': '#EEE',
		'--color-accent': '#00e6ff',
		'--color-light': '#ec00ff',
		'--color-mid': '#4f23d7',
		'--color-dark': '#011627',
		'--color-highlight': '#ffd70e',
		'--shadow-drop': 'drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.5))',
		'--shadow-top': '0px 2px 4px 0 rgba(0, 0, 0, 0.2), 0px -4px 10px 0px rgba(0, 0, 0, 0.2)',
	}

	// Get custom or default theme
	const storage = localStorage.getItem('theme')

	// If theme is set use it else use default theme and set it
	const theme =  storage && Object.values(storage).length ? JSON.parse(storage) : defaults

	setTheme(theme)
}
/**
 * @description Set theme & store for later 
 * 
 *  @param {Object} theme => theme object of css vars
 */
function setTheme( theme ) {	
    for (const key in theme){
        document.documentElement.style.setProperty(key, theme[key])
	}
	
	localStorage.setItem('theme', JSON.stringify(theme))
}


/**
 * @description Load Main Directory View 
 * 
 *  @param {Object} config => settings to load in optional ways
 */
function loadRepo( config ){

	if (config.clear) {
		while (dom.container.lastChild) {
			dom.container.removeChild(dom.container.lastChild)
		}
	}
	
	const projects = Repo.list().map(name => Repo.inspect(`${Path}/${name}`, { times: true }))

	const dirs = projects.filter(p => p.type === 'dir')

	if(config.order === 'date-asc'){
		
		const order = dirs.sort((x,y) => y.modifyTime - x.modifyTime)
		order.map( addToView )

		localStorage.setItem('order', config.order)
	}
	else {
		dirs.map( addToView )
	}
}


/**
 * @description Add to main container view
 * @param {Object} dir => jetpack-ed directory of project
 */
function addToView( dir ){

	const folder = document.createElement('reapo-folder')

	folder.path = Repo.cwd()
	folder.name = dir.name
	folder.date = dir.modifyTime

	dom.container.appendChild(folder)
}


/**
 * @description Toast message to user
 * @param {String} msg the message to display
 */
function toast( msg, time ){

	dom.footer.textContent = msg
	setTimeout(() => dom.footer.textContent = '', time ? time : 5000)
}





{ /* Global Listeners, hotkey bubble ups */
	
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

	dom.header.addEventListener('filter', event => {
		const { value } = event.detail
		dom.container.childNodes.forEach(el => {
			if (el.title) { 
				const check = el.title.toLowerCase().includes(value.toLowerCase())
				el.style.display = check ? 'inline' : 'none'
			}
		})
	})
}

{ /* Repo Details */

	/* Opener */
	dom.container.addEventListener('open-details', e => dom.details.open(e.detail))
	
	/* Exec commands for User */
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
		
		const filepath = `${Path}${folder}/.`

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

	/* Refresh Directory */
	dom.settings.addEventListener('refresh-repo', () => loadRepo({ clear: true }))
}



/* Help for unix PATH vars so reapo can run installed CLI tools on behalf of user */
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
async function Archive(event){

	
	//delete node_package? might not have deps listed, maybe option later in settings #todo
	//console.dir(Archiver.directory)
	//run thru handleRepo
	try {
		
		const data = {
			toast,
			detail: event.detail,
		}

		ipcRenderer.send('archive', data)

		ipcRenderer.on('archive-res', (event, msg) => {
				
			dom.details.close()
			toast(msg)
			// Ask to Delete repo after toasting success msg
			setTimeout(() => dom.details.dom.remove.click(), 1500)
		})
	}
	catch(error){
		toast(error)
	}
}


/**
 * @description Quit Reapo
 * 
 */
function quit() {
	
	remote.getCurrentWindow().close()
}

/**
 * @description Restart Reapo
 * 
 */
function restart(){

	remote.app.relaunch()
}

/**
 * @description Create a new directory
 * 
 */
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

{ /* Open in Terminal (external) */

	dom.details.addEventListener('terminal-popout', event => {

		event.detail.resolve = () => toast(`Opened ${e.detail.title} in Terminal 🦄`)

		ipcRenderer.send('terminal-popout', event.detail)
	})
}

{ /* Sort Projects */

	dom.sortDir.addEventListener('sort', event => {

		const { order } = event.detail

		localStorage.setItem('order', order)

		loadRepo({
			order,
			clear: true,
		})
	})
}

window.scrollTo(0, 0) 
