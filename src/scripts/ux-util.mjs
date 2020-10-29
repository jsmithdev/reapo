export function anchorLinksInText(text) {

	const regex = /(https?:\/\/[^\s]+)/g

	return text.replace(regex, url => `<a title="Open in browser" href="${url}">${url}</a>`)
}