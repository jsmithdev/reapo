
const { ipcRenderer } = require('electron')

process.once('loaded', () => {
	
	window.addEventListener('message', messageHandler)

})

function messageHandler(event){
	//console.log(event)
	if (event.data.type === 'select-parent-directory') {
		selectParentDirectory(event.data.type)
	}
}

function selectParentDirectory(type){
	//console.log(type)
	ipcRenderer.send(type)
	ipcRenderer.on(`${type}-res`, (event, dirs) => {

		window.postMessage({
			type: `${type}-res`,
			dirs
		})
	})
}
