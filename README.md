
# <img src="https://i.imgur.com/mkLNLOB.png" width="45" height="auto" > Reapo 

## A repo manager built with web components 

<img src="https://i.imgur.com/KV5YAAR.png" width="75%" height="auto" >

### Early releases are under [Releases](https://github.com/jsmithdev/reapo/releases) on GitHub

### Todos are under [Issues](https://github.com/jsmithdev/reapo/issues) on GitHub

---

## Purpose

Wanted a fun repo manager that

- Opens & works quickly then gets out of the way
- Built with vanilla web components/standards to easily to extend and hack on
- Compliments vs code; In between
  - simple (eg: OS file manager)
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

Personally use Linux so R&D is done there but Mac & Windows support is more or less baked in and could be on the same level of priority if need arises (eg: someone else uses, finds and opens an issue on Github)

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