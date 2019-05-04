# Reapo 🗃

## A repo manager built with vanilla web standards 🎉

## Purpose

Wanting a repo manager that...

- Compliments VS Code
- Built with vanilla web components & standards
- Like VS Code, is in the middle between
  - dumb (eg: OS file manager)
  - heavy (eg: gitkraken)

Reapo has some tricks already like...

- quick filter (Ctrl+F)
- quick open in VS Code
- quick new repo, Salesforce project or git clone (Ctrl+N)
  - auto opens in VS Code on creation
- quick run commands with
  - shortcut icons for ls, git sync, etc
  - or via the terminal like interface (screenshot below)

 Releases are [Releases](https://github.com/jsmithdev/reapo/releases) on GitHub.

Any todos are under [Issues](https://github.com/jsmithdev/reapo/issues) on GitHub.

---

![shot](https://i.imgur.com/ZKqvCKn.png)

---

## Develop Reapo

Rebased to use electron-forge. To install Electron Forge:

```npm i -g electron-forge```

### To install

After cloning the repo and/or opening the reapo dir:

```npm i```

### To start

```npm run start```

### To package

```npm run package```

### To make (create an installer for your OS)

```npm run make```

### To publish

```npm run publish```

---

Made with 💙 by [Jamie Smith](https://jsmith.dev)