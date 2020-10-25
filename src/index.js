// process.env.debug = true

const path = require('path')

const mkdir = require('mkdirp')
const Archiver = require('./scripts/archive.js')

const windowStateKeeper = require('electron-window-state')

const { app, protocol, ipcMain, dialog, BrowserWindow } = require('electron')

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


	app.isReady()
		? createWindow()
		: app.on('ready', createWindow)
}





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
	
	// Load the previous state with fallback to defaults
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800,
		icon: path.resolve(`${__dirname}/../assets/icons/png/128x128.png`)
	})

	// Create the window using the state information
	mainWindow = new BrowserWindow({
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
			contextIsolation: false,
			//nodeIntegration: false,
			//enableRemoteModule: false,
			//contextIsolation: true,
			//sandbox: true
		}
	})

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow)
	

	// and load the index.html of the app
	mainWindow.loadURL('app://./index.html')

	// Open the DevTools
	if(process.env.debug){
		mainWindow.webContents.openDevTools()
	}

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})


/* IPC Communications: Used to run backend processes like executing commands, CRUD,  */


ipcMain.on('select-parent-directory', async (event) => {
	const result = await dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory']
	})
	event.sender.send('select-parent-directory-res', result.filePaths)
}) 

ipcMain.on('home-dir', (event) => {
	event.sender.send('home-dir-res', app.getPath('home'))
})

ipcMain.on('mk-dir', (event, data) => {
	
	const { name, cmd, cwd } = data

	const path = `${cwd}${name}`

	mkdir(path, { recursive: true }, error => {
		
		if(error){
			console.error(error)
		}
		
		event.sender.send('mk-dir-res', `Created ${name}, happy hacking 🦄`)
		
		// Auto open in vs code upon success
		execute(cmd, cwd)
	})
})



ipcMain.on('archive', async (event, data) => {
	
	const { toast, detail } = data
	
	const msg = await Archiver.directory(detail, toast)

	event.sender.send('archive-res', msg)
})



ipcMain.on('vs-code', async (event, data) => {
	return new Promise(resolve => {

		const { cmd, cwd, exit } = data
		
		execute(cmd, cwd, resolve, exit)
	})
})


ipcMain.on('terminal-popout', (event, data) => {

	const { cmd, cwd, resolve } = data
	
	execute(cmd, cwd, resolve)
})



/* Exec on behalf of user */
function execute(cmd, cwd, responder, exit){

	//console.log(`${cmd} ${cwd} ${responder} ${exit}`)

	const exec = require('child_process').exec
	const command = cwd ? exec(cmd, { cwd }) : exec(cmd)

	if(typeof responder === 'function'){
		command.stdout.on('data', data => responder(data.toString()))
		command.stderr.on('data', data => responder(data.toString()))
	}
	
	command.on('exit', code => exit ? exit(`Process finished with exit code ${code.toString()}`) : responder ? responder('exit') : null) // code.toString()
}


/* Github */
ipcMain.on('get-issues-count', async (event, args) => {

	const { repo, user, token } = args

	const git = await getGitInfoFromLocalRepo(repo)

	console.log('git info =>')
	console.log(git)

	const list = await listIssues( { user, token }, git.user, git.name )
		//? await listIssues( { user, token }, git.user, git.name )
		//: await listOrgIssues( { user, token }, git.user, git.name )
	
    const issues = list.map(issue => {

        const {
            url,
            title,
            body,
            created_at,
        } = issue;
    
		console.log('issue - index')
		
        return {
			url,
			title,
			body,
			date: new Date(created_at).toLocaleString(),
		}
	})

	event.sender.send('get-issues-count-res', issues)
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


