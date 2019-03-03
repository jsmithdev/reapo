//jshint esversion:6, asi: true
'use strict()'
require('electron-debug')();

const electron = require('electron')
const app = electron.app


let mainWindow

app.on('ready', () => mainWindow = createMainWindow())
.on("window-all-closed", () => app.quit())
  
function createMainWindow() {

	const win = new electron.BrowserWindow({
		frame: true,
		width: 1200,
		height: 1000,
		resizable: true,
		backgroundColor: '#3e3e3c',
		icon: `${__dirname}/resources/icon.png`,
		titleBarStyle: 'customButtonsOnHover'
	})

	//win.webContents.openDevTools()

	win.loadURL(`file://${__dirname}/index.html`)
	win.on('closed', () => mainWindow = null)

	return win
}