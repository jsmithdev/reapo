// jshint esversion:6, asi: true, laxcomma: true

require('./components/reapo-menu/reapo-menu.js')
require('./components/reapo-modal/reapo-modal.js')
require('./components/reapo-folder/reapo-folder.js')
require('./components/reapo-settings/reapo-settings.js')


// const manifest = appDir.read("package.json", "json")


const fs = require('fs')
	, util = require('util')
	, exec = util.promisify(require('child_process').exec)
	, path = localStorage.path ? localStorage.path : ''
    , repo = require('fs-jetpack').dir(path, {})
    , codes = {
	    close: ['Esc']
    };


const dom = {
	filter: document.querySelector('.filter'),
	container: document.querySelector('.container'),
	modal: document.querySelector('reapo-modal'),
	menu: document.querySelector('reapo-menu'),
	settings: document.querySelector('reapo-settings'),
	footer: document.querySelector('footer'),
}

const toast = (msg) => {
	dom.footer.textContent = msg
	setTimeout(() => dom.footer.textContent = '', 4000)
}


const loadRepo = (config) => { // init repo

	if (config.clear) {
		while (dom.container.lastChild) {
			dom.container.removeChild(dom.container.lastChild)
		}
	}

	const projects = repo.list().map(name => repo.inspect(`${path}/${name}`, { times: true }))

	const add = dir => {
		
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

	// dom.settings.close()
}
loadRepo({ clear: true })


{ // Filtering
	dom.filter.addEventListener('keyup', e =>
		dom.container.childNodes.forEach((el) => {
			if (el.title) { el.style.display = el.title.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none' }
		}))
}

{ // Repo Details
	dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))

	dom.modal.addEventListener('exec-modal', e => {
		console.dir(e.detail)
		
		exec(e.detail.cmd, { cwd: e.detail.cwd })
		.then((ev, resp) => e.detail.res(resp, ev))
	})

	/* Open in VS Code */
	dom.container.addEventListener('open-code', e =>  // console.dir(e.detail))
		exec(e.detail.cmd, { cwd: e.detail.cwd })
		.then((ev, resp) => {
			toast(`Opened ${e.detail.title} in VS Code 🦄`)
			e.detail.res(resp, ev)
		})
	)
}

{ // Menu
	const clear = n => setTimeout(() => dom.footer.textContent = '', n || 6000)

	/* Opener */
	dom.menu.onclick = () => dom.settings.open()

	/* Save Main Settings */
	dom.settings.addEventListener('save-settings', (e) => {
        
		const path = e.detail.path
        localStorage.path = path
        
		const msg = `Saved ${path}`
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

	/* Refresh Repos */
	dom.settings.addEventListener('refresh-repo', (e) => {
		loadRepo({ clear: true })
	})

	/* Toaster */
	dom.settings.addEventListener('toast', (e) => {
		toast(e.detail.msg)
		if(e.detail.res){
			res('ran toast')
		}
	})

	/* Close on Esc #todo */
	dom.menu.onkeyup = (e) => {
		console.log(e.code)
		codes.close.includes(e.code) ? e.target.close() : null
	}


	/* Open in VS Code */
	dom.settings.addEventListener('open-code', e =>  // console.dir(e.detail))
		exec(e.detail.cmd, { cwd: e.detail.cwd })
		.then((ev, resp) => {
			toast(`Opened ${e.detail.title} in VS Code 🦄`)
			e.detail.res(resp, ev)
		})
	)
}

