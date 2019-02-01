import "./stylesheets/main.css";

import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import {exec} from 'child_process'
import { remote } from "electron";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";
import {ReapoFolder} from './components/reapo-folder/reapo-folder.js'

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

//const manifest = appDir.read("package.json", "json");
const repoPath = `/home/jamie/repo/`

const repo = jetpack.dir(repoPath, {});
const pjs = repo.list()
const cont = document.querySelector('.container')

{ // init project ui
  const add = title => {
    const div = document.createElement('reapo-folder')
    div.setAttribute('title', title)
    div.setAttribute('path', repoPath)
    div.onclick = () => {
      console.log(`${repoPath}${title}`)
      exec(`code ${repoPath}${title}`)
    }
    cont.appendChild(div)
  }
  pjs.map(x => add(x))
}