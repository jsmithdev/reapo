
# <img src="https://i.imgur.com/mkLNLOB.png" width="45" height="auto" > Reapo 

## A repo manager built with web components & standards


<img src="https://i.imgur.com/PJT204r.png" width="75%" height="auto" >
<img src="https://i.imgur.com/bLdQgx8.png" width="75%" height="auto" >

Releases are on Github under [Releases](https://github.com/jsmithdev/reapo/releases) (Linux & Windows)

Wants & issues are on Github under [Issues](https://github.com/jsmithdev/reapo/issues) 

*There is a complimenting vs code theme now called [Abyski](https://github.com/jsmithdev/abyski)* 

---

## Functions

Some functions include

- Filter ( Ctrl+F )
- Open in VS Code ( </> icon )
- New project, Salesforce project or git clone ( Ctrl+N )
  - Auto opens in VS Code on creation

Run commands in terminal-like view or via shortcut icons which include:

- open in vs code
- open a project's Salesforce org
- list contents
- Archive and backup repos
  - ignores /node_modules, /dist, /out by default
  - offers to delete repo after backup
- git status
- Open git repo in browser
- Open project in your OS file manager
- Clear the terminal
- Delete repo

---

## Potential Issues

#### MacOS
The 'Open in VS Code' feature expects `code` to be a cli command but [VS Code docs state ](code.visualstudio.com/docs/editor/command-line) users on macOS must first run a command (Shell Command: Install 'code' command in PATH) to add VS Code executable to the PATH environment variable. Read the macOS setup guide for help.


---

## Develop Reapo

### Clone it

```git clone https://github.com/jsmithdev/reapo.git && cd reapo```

### Install it

```npm i```

### Start it

```npm run start```

### Package it

```npm run package```

### Make it (create an installer for your current OS)

```npm run make```

---

Made with 💙 by [Jamie Smith](https://jsmith.dev)