
const path = require('path')

const windowStateKeeper = require('electron-window-state')

const { app, protocol, ipcMain, shell, BrowserWindow } = require('electron');


// Base path used to resolve modules
const base = app.getAppPath();

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

/*   let browserWindow;

	const createWindow = () => {
	if (browserWindow) return;
	browserWindow = new BrowserWindow();

	// Option A — using the custom protocol
	// browserWindow.loadURL('app://./index.html');

	// Option B — directly from file
	browserWindow.loadFile('index.html');
  } */

  app.isReady()
    ? createWindow()
    : app.on('ready', createWindow);
}



// todo make this the default Moin Repo/Directory
const home = app.getPath('home')
console.log(home)





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
			nodeIntegration: true
		}
	})

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow)

	// and load the index.html of the app
	mainWindow.loadURL(`app://./index.html`)

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

/* app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
}) */




/* IPC Comms */

ipcMain.on('mk-dir', async (event, path) => {
	return new Promise((resolve, reject) => {
		mkdir(path, { recursive: true }, error => {
			error ? reject(error) : resolve()
		})
	})
});
