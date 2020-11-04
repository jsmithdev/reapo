
const { ipcRenderer } = require('electron')

process.once('loaded', () => {
	
	window.addEventListener('message', messageHandler)

})

function messageHandler(event){
	//console.log(event)
	if (event.data.type === 'select-parent-directory') {
		selectParentDirectory(event.data.type)
	}
	if(event.data.type === 'update-issue'){
		updateIssue( event.data )
	}
}

function selectParentDirectory(type){
	ipcRenderer.send(type)
	ipcRenderer.on(`${type}-res`, (event, dirs) => {

		window.postMessage({
			type: `${type}-res`,
			dirs
		})
	})
}

function updateIssue( data ){
	console.log(data)
	console.log('PRE: '+data.type)
	ipcRenderer.send(data.type, data)
	ipcRenderer.on(`${data.type}-res`, (event, response) => {

		window.postMessage({
			type: `${data.type}-res`,
			response
		})
	})
}
