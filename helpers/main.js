//jshint esversion:6, asi: true

require("./components/reapo-menu/reapo-menu.js")
require("./components/reapo-modal/reapo-modal.js")
require("./components/reapo-folder/reapo-folder.js")
require("./components/reapo-settings/reapo-settings.js")


const fs = require('fs')
const exec = require("child_process").exec
const jetpack = require("fs-jetpack")


const codes = {
	close: ['Esc']
}


const dom = {
	filter: document.querySelector('.filter'),
	container: document.querySelector('.container'),
	modal: document.querySelector('reapo-modal'),
	menu: document.querySelector('reapo-menu'),
	settings: document.querySelector('reapo-settings'),
	footer: document.querySelector('footer'),
}

const toast = msg => {
	dom.footer.textContent = msg
	setTimeout(() => dom.footer.textContent = '', 4000)
}


//const manifest = appDir.read("package.json", "json")
const path = localStorage.path ? localStorage.path : ''

const repo = jetpack.dir(path, {})

const loadRepo = (config) => { // init repo

	if(config.clear){
		while(dom.container.lastChild){
			dom.container.removeChild(dom.container.lastChild)
		}
	}
	
	const projects = repo.list()

	const add = title => {

		const folder = document.createElement('reapo-folder')
		folder.path = repo.cwd()
		folder.title = title
		
		dom.container.appendChild(folder)
	}
	projects.map(x => add(x))

	//give some empty space
	Array.from(Array(4).keys()).map(() => dom.container.appendChild(document.createElement('div')))

	//dom.settings.close()
}
loadRepo({clear: true})


{ // Filtering
	dom.filter.addEventListener('keyup', e => 
		dom.container.childNodes.forEach(el => {
		if(el.title)
			el.style.display = el.title.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none'
	}))
}

{ // Repo Details
	dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))

	dom.modal.addEventListener('exec-modal', e =>  //console.dir(e.detail))
		exec(e.detail.cmd, {cwd: e.detail.cwd}, (ev, resp) => e.detail.res(resp, ev)))

	dom.container.addEventListener('open-code', e =>  //console.dir(e.detail))
		exec(e.detail.cmd, {cwd: e.detail.cwd}, (ev, resp) => {
			toast(`Opened ${e.detail.title} in VS Code 🦄`)
			e.detail.res(resp, ev)
		}))
}

{ // Menu
	
	const clear = n => setTimeout(() => dom.footer.textContent = '', n ? n : 6000)

	dom.menu.onclick = () => dom.settings.open()

	dom.settings.addEventListener('save-settings', e => {
		console.dir(e)
		const path = e.detail.path
		localStorage.path = path
		const msg = `Saved ${path}`
		toast(msg)
		e.detail.res(msg)
	})

	dom.settings.addEventListener('new-repo', e => {

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
			exec('code .', {cwd: path}, (ev, resp) => callback(name, path))
		})
	})

	dom.settings.addEventListener('refresh-repo', e => {
		loadRepo({})
	})

	dom.menu.onkeyup = e => {
		console.log(e.code)
		codes.close.includes(e.code) ? e.target.close() : null
	}

}

