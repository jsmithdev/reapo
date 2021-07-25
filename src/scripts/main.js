const isUnix = navigator.appVersion.indexOf("Win") === -1

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
		return this._repo 
			? this._repo
			: localStorage.getItem('path') && localStorage.getItem('path') !== 'undefined'
				? localStorage.getItem('path')
				: undefined
	},
	set REPO_DIR(path){
		this._repo = path
	},
}


window.api.receive('error', message => toast(message, 5000))

/* Warn first time users to set their main repo dir */
if(!CONFIG.REPO_DIR?.length || CONFIG.REPO_DIR === 'undefined'){
	
	toast('Use the Menu (⚙) to set a Main Directory :umm:', 30*1000)
}



// todo module off all theming 
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

	//console.log('loadRepo caller: ', loadRepo.caller)

	config.clear = config.clear ? config.clear : 'date-asc'

	if (config.clear) {
		while (DOM.container.lastChild) {
			DOM.container.removeChild(DOM.container.lastChild)
		}
	}

	window.api.send("get-directories", CONFIG.REPO_DIR);

	window.api.receive("directories", projects => {

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
	})
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
	folder.git = dir.git
		
	folder.addEventListener('get-issues', async event => {
		const issues = await getIssues( event.detail.repo )
		folder.issues = JSON.stringify(issues)
	})

	const cache = localStorage.getItem(`${CONFIG.REPO_DIR}/${dir.name}__issues`)
	if(cache){
		folder.issues = cache
	}

	DOM.container.appendChild(folder)
}


/**
 * @description return the count of issues from repo on github
 * @param {String} repo the local path to the repo
 */
function getIssues( repo ){

	if(!repo){ return toast('Unable to get issues: no repo path') }

	return new Promise((resolve, rej) => {

		const user = localStorage.getItem('user')
		const token = localStorage.getItem('token')

		window.api.send("get-issues", { repo, user, token });

		window.api.receive("get-issues-res", resolve)
	})
}


/**
 * @description Toast message to user
 * @param {String} msg the message to display
 */
function toast( msg, time ){
	
	if(msg?.message){ msg = msg.message }

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

/**
 * @description open url in browser
 * @param {String} msg the address
 */
function openBrowser( url ){
	
	window.api.send('open-browser', url)
}





{ /* Global Listeners, hotkey bubble ups */
	
	/* Toaster */
	DOM.body.addEventListener('toast', e => {

		toast(e.detail.msg)

		if(typeof e.detail.res == 'function'){
			//res('toasted')
		}
	})
	DOM.body.addEventListener('open-url', e => {
		openBrowser(e.detail.url)
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
	DOM.details.addEventListener('exec-cmd', e => execEvent(e.detail))
	DOM.search.addEventListener('exec-cmd', e => execEvent(e.detail))
	DOM.search.addEventListener('exec-cmd-cancel', e => cancelProcesses(e.detail))

	/* Delete Repo */
	DOM.details.addEventListener('delete-repo', e => {
		
		const name = e.detail.name
		const path = localStorage.path
		
		const cmd = isUnix
			? `rm -Rf ${path}${name}`
			: `rmdir /Q /S ${path}${name}`
		
		execEvent({ cmd })

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

		window.api.send('open-file-man', filepath )
	})



	/* Git Link Repo */
	DOM.details.addEventListener('gitlink', event => {
		
		const cmd = 'git remote -v'

		const { cwd } = event.detail

		const responder = 'git-url'

		const detail = {
			cmd, 
			cwd,
			responder,
		}
		
		window.api.receive(responder, openGitUrl)

		window.api.send("execute", detail)

		function openGitUrl(data) {

			const check = data.indexOf('.git') > 0
			const check2 = data.indexOf('http') > 0
			
			if(check){

				const url = data.substring(data.indexOf('https'), data.indexOf('.git')+4)
				
				openBrowser(url)
			}
			else if(check2) {
				
				const raw = data.substring(data.indexOf('http') , data.length)
				const url = raw.substring(0, raw.indexOf(' '))
				
				openBrowser(url)
			}
			else {
				toast(`:umm: .git url did not pass checks: ${data.substring(0, 250)}...`)
			}
		}
	})
}


/**
 * @description execute a command
 * @param {String} repo the local path to the repo
 */
function execEvent( data ){
	console.log(data)
	if(data?.detail){
		const {detail} = data
		window.api.send("execute", detail)
	}
	else {
		window.api.send("execute", data)
	}
}


function cancelProcesses(){
	/* PROCESSES.forEach(proc => {
		console.log(proc)
		proc.stdout.pause()
		proc.stderr.pause()
		proc.kill()
	}) */
}


/**
 * @description ZIP directory then offer to delete original | 
 * 				Toast response
 * @param {Event} event
 */
async function Archive(event){

	
	//todo delete/skip node_package, others (dist)? might not have deps listed, maybe option later in settings
	try {
		
		const { detail } = event;

		const responder = 'archive-res'

		detail.responder = responder

		console.log(detail)

		window.api.send('archive', detail)
		window.api.receive(responder, callback)

		function callback (msg) {

			DOM.details.close()
			toast(msg, 5000)
			// Ask to Delete repo after toasting success msg
			setTimeout(() => DOM.details.dom.remove.click(), 1500)
		}
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
	window.api.send("quit");
}

/**
 * @description Restart Reapo
 * 
 */
function restart(){

	window.api.send("restart");
}

/**
 * @description Create a new directory
 * 
 */
function newRepo(event) {
	
	window.api.send('mk-dir', event.detail)
}


{ /* Open in VS Code */

	const openVsCode = event => {

		window.api.send("vs-code", event.detail);

		window.api.receive("vs-code-res", _ => {
			toast(`Opened ${event.detail.title} in VS Code :unicorn:`)
		})
	}

	DOM.container.addEventListener('open-code', openVsCode)
	DOM.header.addEventListener('open-code', openVsCode)
	DOM.details.addEventListener('open-code', (e) => openVsCode(e))
	
	DOM.search.addEventListener('open-code', (e) => openVsCode(e))
}


window.scrollTo(0, 0) 
