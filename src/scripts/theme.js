

function initiate(localStorage){
	// Default Theme
	const defaults = {
		'--color-lightest': '#EEE',
		'--color-accent': '#00e6ff',
		'--color-light': '#ec00ff',
		'--color-mid': '#4f23d7',
		'--color-dark': '#011627',
		'--color-highlight': '#ffd70e',
		'--shadow-drop': 'drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.5))',
		'--shadow-top': '0px 2px 4px 0 rgba(0, 0, 0, 0.2), 0px -4px 10px 0px rgba(0, 0, 0, 0.2)',
	}

	// Get custom or default theme
	const storage = localStorage.getItem('theme')

	// If theme is set use it else use default theme and set it
	const theme =  storage ? JSON.parse(storage) : defaults

	setTheme()
}

function setTheme( theme, localStorage ) {	
    for (const key in theme){
        document.documentElement.style.setProperty(key, theme[key])
	}
	
	localStorage.setItem('theme', theme)
}

//export for later consumption
export { initiate, setTheme }