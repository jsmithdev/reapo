import "./stylesheets/main.css";

import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import env from "env"
import {exec} from "child_process"
import { remote } from "electron"
import jetpack from "fs-jetpack"
import { greet } from "./hello_world/hello_world"
//import {ReapoModal} from "./components/reapo-folder/reapo-modal.js"
import {ReapoFolder} from "./components/reapo-folder/reapo-folder.js"

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

//const manifest = appDir.read("package.json", "json");
const repoPath = `/home/jamie/repo/`

const repo = jetpack.dir(repoPath, {});
const projects = repo.list()
const dom = {
  container: document.querySelector('.container'),
  filter: document.querySelector('.filter')
}

{ // init project ui
  const add = title => {
    const div = document.createElement('reapo-folder')
    div.setAttribute('title', title)
    div.setAttribute('path', repoPath)
    div.onclick = () => {
      console.log(`${repoPath}${title}`)
      exec(`code ${repoPath}${title}`)
    }
    dom.container.appendChild(div)
  }
  projects.map(x => add(x))
}

console.dir(dom.filter)

dom.filter.addEventListener('keyup', e => 
  dom.container.childNodes.forEach(el => 
    el.style.display = el.title.toLowerCase().includes(e.target.value.toLowerCase()) ? 'inline' : 'none'))