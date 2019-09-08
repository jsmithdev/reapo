
# <img src="https://i.imgur.com/mkLNLOB.png" width="45" height="auto" > Reapo 

## A hackable repo manager built with web components & standards

<img src="https://i.imgur.com/PJT204r.png" width="75%" height="auto" >
<img src="https://i.imgur.com/bLdQgx8.png" width="75%" height="auto" >

### Early releases are under [Releases](https://github.com/jsmithdev/reapo/releases) on GitHub

### Todos and issues are under [Issues](https://github.com/jsmithdev/reapo/issues) on GitHub

---

## Purpose

Wanted a repo manager that

- Opens & works quickly then gets out of the way
- Built with web components & standards to easily to extend and hack on
- Compliments vs code; In between
  - dumb (eg: OS file manager)
  - complex (eg: Gitkraken)


Some functions include
- Filter ( Ctrl+F )
- Open in VS Code ( </> icon )
- New project, Salesforce project or git clone ( Ctrl+N )
    - Auto opens in VS Code on creation
- Run commands in terminal-like view or via shortcut icons which include:
    - ls
    - Archive (offers to delete after backup)
    - git status
    - Open in Github ( runs `git remote -v` & parses URL to open in default browser )
    - Open in OS file manager
    - Clear terminal
    - Delete

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

### Publish it

```npm run publish```

---

Made with 💙 by [Jamie Smith](https://jsmith.dev)