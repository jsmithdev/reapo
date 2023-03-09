<!-- markdownlint-disable MD033 MD028 -->

# <img src="https://i.imgur.com/QgLQMsf.png" width="45" height="auto" > Reapo  

## Linux repository manager built with native web components & standards

<img src="https://i.imgur.com/ZZNvmQ0.png" width="500" height="auto" >

[Issues](https://github.com/jsmithdev/reapo/issues)

[Releases](https://github.com/jsmithdev/reapo/releases)

> Reapo compliments VS Code and has a matching theme: [Abyski](https://github.com/jsmithdev/abyski)

---

### Functions

#### Header

<img src="https://i.imgur.com/CUjdsQR.png" width="500" height="auto" >

The 5 main functions in the header, some have a hotkey, going left to right are:

1 - Refresh repos ( Ctrl+R )

2 - Order By Date (latest modified project would be at the top) or Alphabetically

3 - Filter projects from view ( Ctrl+F )

4 - Search all projects for a particular string ( Ctrl+S )

  * 4a - choose a result to open that project in VS Code to that particular file the string was found in <img src="https://i.imgur.com/hLtGWla.png" width="500" height="auto" >

5 - Settings / Menu ( Ctrl+N )

  * 5a - Add your main repo directory where all your projects you want included live
  * 5b - Create a New project, Salesforce project or git clone by adding git url 
  * 5c - Any way you choose to create a new project, it will auto open project in VS Code
  <img src="https://i.imgur.com/hdpgFRF.png" width="500" height="auto" >

---

#### Detail view

When you select a project you'll see a detail screen

<img src="https://i.imgur.com/7kkpnU7.png" width="500" height="auto" >

Here you could run commands in terminal-like view or via shortcut icons, left to right, which include:

* Open in VS Code ( </> icon )
* Open git repo in browser
* List contents
* Open project in your OS file manager
* Open in your OS's terminal
* Clear the terminal like view
  * Can also type `clear` in the input as you would a normal terminal
* Open a project's Salesforce org
* Quickly run ```git status```
* Quickly view the projects README (below under "Readme Example" is a screenshot )
* Archive and backup repos
  * ignores /node_modules, /dist, /out by default
  * offers to delete repo after backup
* Delete repo
  * Will confirm prior to actually moving to your trash

[*] Any command with output, like list contents, goes in the terminal like view, with project name & date time stamp, which you can go back to, copy, etc

##### Readme Example

<img src="https://i.imgur.com/eIGm3i2.png" width="500" height="auto" >

---

### Potential Issues

#### MacOS

This isn't currently being built for MacOS however it would be fairly straitforward for someone to do so leaving this here from VS Code docs:

The 'Open in VS Code' feature expects `code` to be a cli command but [VS Code docs state](code.visualstudio.com/docs/editor/command-line) users on macOS must first run a command (Shell Command: Install 'code' command in PATH) to add VS Code executable to the PATH environment variable. Read the macOS setup guide for help.'

---

## Develop Reapo

### Clone

```git clone https://github.com/jsmithdev/reapo.git && cd reapo```

### Install

```npm i```

### Start it

```npm run start```

### Start it (with dev tools)

```npm run start:dev```

### Build it

```npm run build:linux```

---

Made with 💙 by [Jamie Smith](https://jsmith.dev)