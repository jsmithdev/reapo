// 
const { ipcRenderer, shell, remote, app } = require('electron')
const Repo = require('fs-jetpack')

const codes = {
	find: ['KeyF'],
	exit: ['KeyW'],
	restart: ['KeyR'],
	close: ['Escape'],
	settings: ['KeyM', 'KeyN'],
	search: ['KeyS'],
}

const DOM = {
	
	body: document.querySelector('body'),
	container: document.querySelector('.container'),
	details: document.querySelector('reapo-details'),
	footer: document.querySelector('footer'),
	header: document.querySelector('reapo-header'),
	search: document.querySelector('search-repos'),
}

const CONFIG = {
	
	get REPO_DIR(){
		return this._repo ? this._repo
			: localStorage.getItem('path') ? localStorage.getItem('path')
			: this.HOME_DIR ? this.HOME_DIR
			: undefined
	},
	set REPO_DIR(path){
		this._repo = path
	},
	HOME_DIR: undefined,
}

/* Kick off */
if(!CONFIG.REPO_DIR){
	
	toast('Use Settings to set a Main Directory')

	ipcRenderer.send('home-dir')
	ipcRenderer.on('home-dir-res', (event, path) => {
			
		CONFIG.HOME_DIR = path

		console.log('home-dir got path: '+path)
		
		loadRepo({ 
			clear: false,
			order: localStorage.getItem('order') ? localStorage.getItem('order') : 'date-asc',
		})
	})
}
else {
	console.log('CONFIG.REPO_DIR was : '+CONFIG.REPO_DIR)

	loadRepo({ 
		clear: false,
		order: localStorage.getItem('order') ? localStorage.getItem('order') : 'date-asc',
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
 *  @param {Object} config => settings to load in options
 */
function loadRepo( config ){

	config.clear = config.clear ? config.clear : 'date-asc'

	if (config.clear) {
		while (DOM.container.lastChild) {
			DOM.container.removeChild(DOM.container.lastChild)
		}
	}

	const projects = Repo.list(CONFIG.REPO_DIR).map(name => {
		return Repo.inspect(`${CONFIG.REPO_DIR}/${name}`, { times: true })
	})

	const dirs = projects.filter(p => p.type && p.type === 'dir')

	if(config.order === 'name-asc' || localStorage.order === 'name-asc' ){
		dirs.map( addToView )
	}
	else {
		const order = dirs.sort((x,y) => y.modifyTime - x.modifyTime)
		order.map( addToView )
	}
	
	if(config.order !== localStorage.getItem('order')){
		localStorage.setItem('order', config.order)
	}
}


/**
 * @description Add to main container view
 * @param {Object} dir => jetpack-ed directory of project
 */
function addToView( dir ){
	
	const folder = document.createElement('reapo-folder')

	folder.path = CONFIG.REPO_DIR
	folder.name = dir.name
	folder.date = dir.modifyTime
	folder.git = Repo.list(`${CONFIG.REPO_DIR}/${dir.name}`)
		.some(name => name === '.git')
	folder.addEventListener('get-issues', async event => {
		console.log('GET ISSUE MAIN00')
		const issues = await getIssueCount( event.detail.repo )
		folder.issues = JSON.stringify(issues)
	})

	DOM.container.appendChild(folder)
}


/**
 * @description return the count of issues from repo on github
 * @param {String} repo the local path to the repo
 */
function getIssueCount( repo ){

	console.log('GET ISSUE MAIN0 '+ repo)

	if(!repo){ return toast('Unable to get issues: no repo path') }

	return new Promise((resolve, rej) => {

		const user = localStorage.getItem('user')
		const token = localStorage.getItem('token')

		console.log('SENDING')
		console.log({ repo, user, token })

		ipcRenderer.send('get-issues', { repo, user, token })
		ipcRenderer.on('get-issues-res', (event, data) => {
					
	
			console.log('GET ISSUE MAIN')
			console.log(data)
			
			resolve(data)
		})
	})
}


/**
 * @description Toast message to user
 * @param {String} msg the message to display
 */
function toast( msg, time ){

	if(!msg){ return console.log('toast sent w/ out message :/') }

	DOM.footer.classList.add('notice')
	setTimeout(() => {
		DOM.footer.classList.remove('notice')
	}, 750)
	
	DOM.footer.textContent = msg
		.replace(':good:', '🎉')
		.replace(':bad:', '👎')
		.replace(':umm:', '😕')
		.replace(':note:', '📌')
		.replace(':unicorn:', '🦄')
	
	setTimeout(() => DOM.footer.textContent = '', time ? time : 5000)
}





{ /* Global Listeners, hotkey bubble ups */
	
	/* Toaster */
	DOM.body.addEventListener('toast', e => {

		toast(e.detail.msg)

		if(typeof e.detail.res == 'function'){
			//res('toasted')
		}
	})

	DOM.body.onkeyup = e => { //console.log(e.code+e.ctrlKey)
		
		/* Close overlay on Esc press */
		if(codes.close.includes(e.code)){
			DOM.header.close()
			DOM.details.close()
			DOM.search.close()
		} 

		/* Close Reapo on Ctrl+W press */
		e.ctrlKey && codes.exit.includes(e.code) ? quit() : null 

		/* Restart Reapo on Ctrl+R hotkey */
		e.ctrlKey && codes.restart.includes(e.code) ? restart() : null 

		/* Focus filter on Ctrl+F hotkey */
		e.ctrlKey && codes.find.includes(e.code) ? DOM.header.focus() : null 

		/* Open Settings hotkey */
		e.ctrlKey && codes.settings.includes(e.code) ? DOM.header.open({ value: 'settings' }) : null

		/* Open Search hotkey */
		e.ctrlKey && codes.search.includes(e.code) ? toggleSearch() : null
	}
}

{ /* Header */

	DOM.header.addEventListener('filter', event => {
		const { value } = event.detail
		DOM.container.childNodes.forEach(el => {
			if (el.title) { 
				const check = el.title.toLowerCase().includes(value.toLowerCase())
				el.style.display = check ? 'inline' : 'none'
			}
		})
	})

	

	DOM.header.addEventListener('sort', event => {
		
		const { order } = event.detail

		localStorage.setItem('order', order)

		loadRepo({
			order,
			clear: true,
		})
	})

	DOM.header.addEventListener('open-search', toggleSearch)

	DOM.header.addEventListener('load-repo', event => {
		
		const { order } = event.detail

		localStorage.setItem('order', order)

		loadRepo({
			order,
			clear: true,
		})
	})

	/* dom container */
	DOM.container.addEventListener('show-issues', showIssues)
}


/* Show issues from git */		
function showIssues(event){

	const {
		repo,
		issues,
	} = event.detail

	console.log(repo)
	console.log(issues)
}

/* Search */		
function toggleSearch(){
	if(!DOM.search.active){
		DOM.search.open({
			directory: CONFIG.REPO_DIR,
		})
	}
	else {
		DOM.search.close()
	}
}

{ /* Repo Details */

	/* Opener */
	DOM.container.addEventListener('open-details', e => DOM.details.open(e.detail))
	
	/* Exec commands for User */
	DOM.details.addEventListener('exec-cmd', e => execEvent(e))
	DOM.search.addEventListener('exec-cmd', e => execEvent(e))
	DOM.search.addEventListener('exec-cmd-cancel', e => cancelProcesses(e))

	/* Delete Repo */
	DOM.details.addEventListener('delete-repo', e => {
		
		const name = e.detail.name
		const path = localStorage.path
		
		const cmd = process.platform !== 'win32'
			? `rm -Rf ${path}${name}`
			: `rmdir /Q /S ${path}${name}`
		
		exec(cmd)

		loadRepo({ clear: true })
		//toast(x.stderr || x.stdout)
		DOM.details.close()
	})

	/* Archive Repo */
	DOM.details.addEventListener('archive', Archive)

	/* open-directory */
	DOM.details.addEventListener('open-directory', event => {
		
		const { folder } = event.detail
		
		const filepath = `${CONFIG.REPO_DIR}${folder}/.`

		shell.showItemInFolder( filepath )
	})



	/* Git Link Repo */
	DOM.details.addEventListener('gitlink', e => {
		
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
				toast(`:umm: ${data.substring(0, 250)}...`)
			}
		}
		
		exec(cmd, e.detail.cwd, responder)
	})
}




/* Help for unix PATH vars so reapo can run installed CLI tools on behalf of user */
if (process.platform !== 'win32') {

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

function cancelProcesses(){
	/* PROCESSES.forEach(proc => {
		console.log(proc)
		proc.stdout.pause()
		proc.stderr.pause()
		proc.kill()
	}) */
}

/* Exec on behalf of user */
function exec(cmd, cwd, responder, exit){

	//console.log(`${cmd} ${cwd} ${responder} ${exit}`)

	const exec = require('child_process').exec
	const command = cwd ? exec(cmd, { cwd }) : exec(cmd)
	//PROCESSES.push(command)

	if(typeof responder === 'function'){
		command.stdout.on('data', data => responder(data.toString()))
		command.stderr.on('data', data => responder(data.toString()))
	}
	
	command.on('exit', code => {
		
		//PROCESSES.splice(PROCESSES.indexOf(command), 1)

		exit 
			? code
				? exit(`Process finished with exit code ${code.toString()}`) 
				: exit(`Process finished without an exit code`) 
			: responder 
				? responder('exit') 
				: null
	})
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
				
			DOM.details.close()
			toast(msg)
			// Ask to Delete repo after toasting success msg
			setTimeout(() => DOM.details.dom.remove.click(), 1500)
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
	
	//remote.getCurrentWindow().close()
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

	const { responder, exit, name, cmd, cwd } = event.detail

	const data = { name, cmd, cwd }

	ipcRenderer.send('mk-dir', data)

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

	DOM.container.addEventListener('open-code', openVsCode)
	DOM.header.addEventListener('open-code', openVsCode)
	DOM.details.addEventListener('open-code', (e) => openVsCode(e))
	
	DOM.search.addEventListener('open-code', (e) => openVsCode(e))
}

{ /* Open in Terminal (external) */

	DOM.details.addEventListener('terminal-popout', event => {

		event.detail.resolve = () => toast(`Opened ${e.detail.title} in Terminal 🦄`)

		ipcRenderer.send('terminal-popout', event.detail)
	})
}


window.scrollTo(0, 0) 
