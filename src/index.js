process.env.debug = true

const path = require('path')

const mkdir = require('mkdirp')
const Archiver = require('./scripts/archive.js')

const windowStateKeeper = require('electron-window-state')

const { app, protocol, ipcMain, dialog, BrowserWindow, shell, remote } = require('electron')

const Repo = require('fs-jetpack')

const ghissues = require('ghissues')

// Base path used to resolve modules
const base = app.getAppPath()


// Protocol will be "app://./…"
const scheme = 'app'

{ 	/* Protocol */
	// Registering must be done before app::ready fires
	// (Optional) Technically not a standard scheme but works as needed
	
	protocol.registerSchemesAsPrivileged([{ 
		scheme, 
		privileges: { 
			standard: true, 
			secure: true, 
			supportFetchAPI: true 
		}
	}])

	//protocol.registerStandardSchemes([scheme], { secure: true });

	// Create protocol
	require('./scripts/create-protocol')(scheme, base)
}


{ /* BrowserWindow */


	;(async () => {
		await app.whenReady()
		createWindow()
	})();
}





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window

function createWindow() {
	
	// Load the previous state with fallback to defaults
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800,
		icon: path.resolve(`${__dirname}/../assets/icons/png/128x128.png`)
	})

	// Create the window using the state information
	window = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
			enableRemoteModule: true,
			sandbox: false,
			worldSafeExecuteJavaScript: true,
			// todo set to true #45
			contextIsolation: true,
			//nodeIntegration: false,
			//enableRemoteModule: false,
			//contextIsolation: true,
			//sandbox: true
		}
	})

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(window)
	

	// and load the index.html of the app
	window.loadURL('app://./index.html')

	// Open the DevTools
	if(process.env.debug){
		window.webContents.openDevTools()
	}

	// Emitted when the window is closed.
	window.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		window = null
	})
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

/* Help for unix PATH vars so reapo can run installed CLI tools on behalf of user */
if (process.platform !== 'win32') {

	const shellPath = require('shell-path')
	
	process.env.PATH = shellPath.sync() || [
		'./node_modules/.bin',
		'/.nodebrew/current/bin',
		'/usr/local/bin',
		process.env.PATH
	].join(':')
}

/* IPC Communications: Used to run backend processes like executing commands, CRUD,  */

ipcMain.on('get-directories', async (event, directory) => {
	
	if(!directory){ return }
	
	const dirs = Repo.list(directory)
		.map(name => {
			return Repo.inspect(`${directory}/${name}`, { times: true })
		})
		.filter(dir => {
			return dir.type === 'dir'
		})
	
	const projects = dirs.map(dir => {
		dir.git = Repo.list(`${directory}/${dir.name}`)
			.some(name => name === '.git')
		return dir
	})
	
	window.webContents.send("directories", projects)
}) 

ipcMain.on('select-parent-directory', async (event) => {
	const result = await dialog.showOpenDialog(window, {
		properties: ['openDirectory']
	})
	
	window.webContents.send("select-parent-directory-res", result.filePaths)
	//event.sender.send('select-parent-directory-res', result.filePaths)
}) 

ipcMain.on('home-dir', (event) => {
	window.webContents.send("home-dir-res", result.filePaths)
	//event.sender.send('home-dir-res', app.getPath('home'))
})

ipcMain.on('mk-dir', (event, data) => {
	
	const { name, cmd, cwd } = data

	const path = `${cwd}${name}`

	mkdir(path, { recursive: true }, error => {
		
		if(error){
			console.error(error)
		}
		
		window.webContents.send('mk-dir-res', `Created ${name}, happy hacking 🦄`)
		
		// Auto open in vs code upon success
		execute(cmd, cwd)
	})
})



ipcMain.on('archive', async (event, detail) => {

	const msg = await Archiver.directory(detail, window)

	window.webContents.send('archive-res', msg)
})



ipcMain.on('vs-code', async (event, data) => {
	
	const resolve = arg =>	window.webContents.send("vs-code-res", arg)

	const { cmd, cwd } = data
	
	execute(cmd, cwd, resolve)
})

ipcMain.on('open-browser', (event, url) => {
	shell.openExternal(url)
})


ipcMain.on('terminal-popout', (event, data) => {

	const { cmd, cwd, resolve } = data
	
	execute(cmd, cwd, resolve)
})

ipcMain.on('restart', (event, data) => {
	app.relaunch()
	app.exit(0)})

ipcMain.on('quit', (event, data) => {
	app.exit(0)
})

/* Github */
ipcMain.on('get-issues', async (event, args) => {

	const { repo, user, token } = args

	const git = await getGitInfoFromLocalRepo(repo)

	const list = await listIssues( { user, token }, git.user, git.name )

    const issues = list.map(issue => {

        const {
            url,
            title,
            body,
            created_at,
        } = issue;

        return {
			url,
			title,
			body,
			date: new Date(created_at).toLocaleString(),
		}
	})

	window.webContents.send('get-issues-res', issues)
})

/* Generic Commands */
ipcMain.on('execute', async (event, detail) => {
	
	const { cmd, cwd, responder, exit } = detail;
	
	execute(cmd, cwd, responder, exit)
})

/* Open in OS file manager */
ipcMain.on('open-file-man', async (event, path) => {
	shell.showItemInFolder( path )
})


function listIssues(auth, user, repo){
    return new Promise((res, rej) => ghissues.list(auth, user, repo,  (error, issues) => 
        error ? rej(error) : res(issues)))
}
function listOrgIssues(auth, user, repo){
    return new Promise((res, rej) => ghissues.listOrg(auth, user, repo,  (error, issues) => 
        error ? rej(error) : res(issues)))
}

function getGitInfoFromLocalRepo(repo){

	return new Promise(resolve => {

		const cmd = 'git remote -v'
		const cwd = repo

		const responder = data => {

			const check = data.indexOf('http') > -1
			
			if(check){
	
				const part = data.substring(data.lastIndexOf('/')+1, data.length) 

				const name = part.substring(0, part.lastIndexOf(' '))
					.replace('.git', '')

				const user = data.substring(data.indexOf('.com/')+5, data.indexOf(name)-1)

				resolve( {name, user} )
			}
			else {
				console.log(`:umm: ${data.substring(0, 250)}...`)
			}
		}
		
		execute(cmd, cwd, responder)
	})
}



/* Exec on behalf of user */
function execute(cmd, cwd, responder, exit){

	//console.log(`${cmd} ${cwd} ${responder} ${exit}`)

	const exec = require('child_process').exec
	
	const command = cwd ? exec(cmd, { cwd }) : exec(cmd)

	if(typeof responder === 'string'){

		command.stdout.on('data', data => {
			//console.log('Has data ', data)
			window.webContents.send(responder, data.toString())
		})
		command.stderr.on('data', data => {
			console.log('Has ERROR: ', data.toString())
			window.webContents.send( 'error', data.toString() )
		});

	}
	else if(typeof responder === 'function'){
		command.stdout.on('data', data => responder(data.toString()))
		command.stderr.on('data', data => responder(data.toString()))
	}
}