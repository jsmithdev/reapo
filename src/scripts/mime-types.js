import { extname } from 'path'

const mime = {}
mime[''] = 'text/plain',
mime['.js'] =
mime['.ts'] =
mime['.mjs'] = 'text/javascript',
mime['.html'] =
mime['.htm'] = 'text/html',
mime['.json'] = 'application/json',
mime['.css'] = 'text/css',
mime['.svg'] = 'application/svg+xml';

export function mimeTypeFor (filename) {
	mime[extname(`${filename || ''}`).toLowerCase()];
}
