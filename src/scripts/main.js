// jshint esversion:6, asi: true, laxcomma: true

require('./components/reapo-menu/reapo-menu.js')
require('./components/reapo-modal/reapo-modal.js')
require('./components/reapo-folder/reapo-folder.js')
require('./components/reapo-settings/reapo-settings.js')


// const manifest = appDir.read("package.json", "json")


const fs = require('fs')
	, exec = require('child_process').exec
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
		folder.title = dir.modifyTime

		dom.container.appendChild(folder)
	}
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
		
		exec(e.detail.cmd, { cwd: e.detail.cwd }, (ev, resp) => e.detail.res(resp, ev))
	})

	dom.container.addEventListener('open-code', e =>  // console.dir(e.detail))
		exec(e.detail.cmd, { cwd: e.detail.cwd }, (ev, resp) => {
			toast(`Opened ${e.detail.title} in VS Code 🦄`)
			e.detail.res(resp, ev)
		}))
}

{ // Menu
	const clear = n => setTimeout(() => dom.footer.textContent = '', n || 6000)

	dom.menu.onclick = () => dom.settings.open()

	dom.settings.addEventListener('save-settings', (e) => {
        
		const path = e.detail.path
        localStorage.path = path
        
		const msg = `Saved ${path}`
		toast(msg)
        loadRepo({ clear: true })
        
        e.detail.res(msg)
	})

	dom.settings.addEventListener('new-repo', (e) => {
		console.log('new repo')
		console.dir(e)


		const callback = (name, path) => {
			toast(`Created ${path}`)

			dom.filter.value = name
			dom.filter.keyup()
			dom.settings.close()
		}

		const name = e.detail.name
		const path = `${localStorage.path}/${name}`
		fs.mkdir(path, { recursive: true }, (err) => {
			if (err) throw err;
			loadRepo({})
			exec('code .', { cwd: path }, (ev, resp) => callback(name, path))
		})
	})

	dom.settings.addEventListener('refresh-repo', (e) => {
		loadRepo({})
	})

	dom.menu.onkeyup = (e) => {
		console.log(e.code)
		codes.close.includes(e.code) ? e.target.close() : null
	}
}

