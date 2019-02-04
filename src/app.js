//jshint esversion:6, asi: true
import "./stylesheets/main.css";

import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import env from "env"
import {exec} from "child_process"
import { remote } from "electron"
import jetpack from "fs-jetpack"

import {ReapoFolder} from "./components/reapo-folder/reapo-folder.js"
import {ReapoModal} from "./components/reapo-modal/reapo-modal.mjs"
import {ReapoSettings} from "./components/reapo-settings/reapo-settings.mjs"

document.body.appendChild(new ReapoModal())
document.body.appendChild(new ReapoSettings())

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());


const dom = {
  filter: document.querySelector('.filter'),
  container: document.querySelector('.container'),
  modal: document.querySelector('reapo-modal'),
  menu: document.querySelector('#menu'),
  settings: document.querySelector('reapo-settings'),
  footer: document.querySelector('footer'),
}

//const manifest = appDir.read("package.json", "json")
const path = localStorage.path ? localStorage.path : ''

const repo = jetpack.dir(path, {})


{ // init repo
  
  const projects = repo.list()
  
  const add = title => {
    const div = new ReapoFolder(title, path+title)
    div.exec = exec
    
    dom.container.appendChild(div)
  }
  projects.map(x => add(x))
  
  //give some empty space
  Array.from(Array(4).keys()).map(() => dom.container.appendChild(document.createElement('div')))
}

{ // Filtering
  dom.filter.addEventListener('keyup', e => 
    dom.container.childNodes.forEach(el => {
      if(el.name)
        el.style.display = el.name.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none'
  }))
}

{ // Repo Details
  dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))

  dom.modal.addEventListener('exec-modal', e =>   
    exec(e.detail.cmd, {cwd: e.detail.cwd}, (ev, resp) => e.detail.res(resp)))
}

{ // Settings
  console.dir(dom)

  dom.menu.onclick = () => dom.settings.open()

  dom.settings.addEventListener('save-settings', e => {
    console.dir(e)
    const path = e.detail.path
    localStorage.path = path
    const msg = `Saved ${path}`
    dom.footer.textContent = msg
    e.detail.res(msg)
  })
}