
const { ipcRenderer, contextBridge } = require('electron')
const { validChannels } = require('./scripts/config')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
			console.log('send channel ', channel)
			console.log('send data ', data)
            if (validChannels.send.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
			console.log('receive channel ', channel)
            if (validChannels.receive.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);

/* 
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

 */