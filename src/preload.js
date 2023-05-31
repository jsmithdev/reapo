import { ipcRenderer, contextBridge } from 'electron'
import { validChannels } from './scripts/config'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
	'api', {
		send: (channel, data) => {
			if (validChannels.send.includes(channel)) {
				ipcRenderer.send(channel, data)
			}
		},
		receive: (channel, func) => {
			if (validChannels.receive.includes(channel)) {
				// Deliberately strip event as it includes `sender` 
				ipcRenderer.on(channel, (event, ...args) => func(...args))
			}
		}
	}
)