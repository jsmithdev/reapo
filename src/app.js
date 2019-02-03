import "./stylesheets/main.css";

import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import env from "env"
import {exec} from "child_process"
import { remote } from "electron"
import jetpack from "fs-jetpack"

import {ReapoFolder} from "./components/reapo-folder/reapo-folder.js"
import {ReapoModal} from "./components/reapo-modal/reapo-modal.mjs"

document.body.appendChild(new ReapoModal())

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

//const manifest = appDir.read("package.json", "json");
const repoPath = `/home/jamie/repo/`

const repo = jetpack.dir(repoPath, {});
const projects = repo.list()
const dom = {
  modal: document.querySelector('reapo-modal'),
  container: document.querySelector('.container'),
  filter: document.querySelector('.filter')
}
{ // init project ui
  const add = title => {
    const div = new ReapoFolder(title, repoPath+title)
    div.exec = exec
    
    dom.container.appendChild(div)
  }
  projects.map(x => add(x))
  
  //give some empty space
  Array.from(Array(4).keys()).map(() => dom.container.appendChild(document.createElement('div')))
}

dom.filter.addEventListener('keyup', e => 
  dom.container.childNodes.forEach(el => {
    if(el.name)
      el.style.display = el.name.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none'
}))


dom.container.addEventListener('open-modal', e => dom.modal.open(e.detail))


dom.modal.addEventListener('exec-modal', e => {
  
  exec(e.detail.cmd, {cwd: e.detail.cwd}, (ev, resp) => e.detail.res(resp))
})

