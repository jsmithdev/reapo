const { main } = process;
import { mimeTypeFor } from './mime-types'
import { app, protocol } from 'electron'
import { URL } from 'url'
import { readFileSync, read } from 'fs'
import { _resolveFilename, resolve } from 'module'

export function createProtocol(scheme, base, normalize = true) {


	// Should only be called after app:ready fires
	if (!app.isReady())
		return app.on('ready', () => createProtocol(...arguments));

	// Normalize standard URLs to match file protocol format
	normalize = !normalize
		? url => new URL(url).pathname
		: url => new URL(
			url.replace(/^.*?:[/]*/, `file:///`) // `${scheme}://./`
		).pathname.replace(/[/]$/, '');

	protocol.registerBufferProtocol(
		scheme,
		(request, respond) => {
			let pathname, filename, data, mimeType;
			try {
				// Get normalized pathname from url
				pathname = normalize(request.url);

				// Resolve absolute filepath relative to mainModule
				filename = resolve(`.${pathname}`, main);

				// Read contents into a buffer
				data = read(filename);

				// Resolve mimeType from extension
				mimeType = mimeTypeFor(filename);

				// Respond with mimeType & data
				respond({ mimeType, data });
			} catch (exception) {
				console.error(exception, { request, pathname, filename, data, mimeType });
			}
		},
		(exception) =>
			exception && console.error(`Failed to register ${scheme} protocol`, exception)
	);

}