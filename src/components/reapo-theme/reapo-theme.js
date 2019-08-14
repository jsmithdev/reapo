/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/reapo-theme/reapo-theme.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.is-hidden {
  display: none;
}
.modal-overlay {
    position: fixed;
    text-align: center;
    vertical-align: middle;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
    padding-top: 12.5%;
}
.card {
	padding: 1rem;
    border-radius: 5px;
    background: #EEE;
}
.colorContainer {
	display: flex;
}
.color {
	margin-right: 1vw;
    width: 100;
    height: 100;
    border: 1pt solid;
    margin-bottom: 1rem;
}
</style>


<div class="card">

	<div class="colorContainer"></div>
	
	
	<color-picker color="#ee6f0a" theme="normal"></color-picker>
	

	<br />
	<button class="save">Save</button>

	
</div>`


export class ReapoTheme extends HTMLElement {

	constructor() {
		super()
		//console.log('hi from constructor')
		this.attachShadow({ mode: 'open' })
	}
	static get is() {
		return 'reapo-theme'
	}

	static get observedAttributes() {
		return ['projects']
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.registerElements(this.shadowRoot)
	}
	registerElements(doc) {
		//console.log('registerElements')

		this.dom = {
			
			save: doc.querySelector('.save'),
			picker: doc.querySelector('color-picker'),
			colorContainer: doc.querySelector('.colorContainer'),
		}

		this.registerListeners()
	}
	registerListeners() {

		/* Close Modal 
		this.dom.overlay.onclick = e => {
			if (e.target == this.dom.overlay) {
				this.close()
			}
		}
		this.addEventListener(`close-${this.is}`, () => this.close())
		*/
		
		
		
		this.dom.save.onclick = () => this.handleSave()

		this.init()
	}

	init(){
		// get stored theme
		const storage = localStorage.getItem('theme')
		const data =  storage ? JSON.parse(storage) : null

		for(const key in data){
			if(key.includes('--color')){
				
				const val = data[key]
				const el = this.shadowRoot.ownerDocument.createElement('div')
				
				el.classList.add('color')
				el.dataset.var = key
				el.style.background = val
				el.onclick = e => this.colorClick(e)

				this.dom.colorContainer.appendChild(el)
			}
		}
	}

	colorClick(e){

		const color = e.target.style.background
		
		this.currentVar = e.target.dataset.var

		this.dom.picker.setColor(color)
	}

	handleSave() {
		// eslint-disable-next-line no-console
		const theme = localStorage.getItem('theme')

		console.log( this.dom.picker.getColor() )
		console.dir( JSON.parse(theme) )
	}


	/* open(){
		this.dom.overlay.classList.remove('is-hidden')
	}

	close(){
		this.dom.overlay.classList.add('is-hidden')
	} */
}
customElements.define(ReapoTheme.is, ReapoTheme)







/* 

/* 

.theme {

	fill: var(--color-light);
    margin: 0.4rem;
}
.theme > path {
	fill: var(--color-light);
    margin: 0.4rem;
    transform: rotate(0deg);
    transition-duration: 3s;
}

animation: AnimationName 30s ease infinite;

@-webkit-keyframes AnimationName {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@-moz-keyframes AnimationName {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@keyframes AnimationName {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}











    
    themeButton: document.querySelector('.themeContainer'),
    themer: document.querySelector('reapo-theme'),
    

	dom.themeButton.onclick = () => {
		dom.themer.open()
    }
    


{	// Handle Theming
	const setTheme = theme => {	
		for (const key in theme){
			document.documentElement.style.setProperty(key, theme[key])
		}
	}

	// Get custom theme
	const storage = localStorage.getItem('theme')
	const data =  storage ? JSON.parse(storage) : null

	// If theme is set use it else use default theme and set it
	const theme = data === 'object' ? data : {
		'--color-lightest': '#EEE',
		'--color-accent': '#00e6ff',
		'--color-light': '#ec00ff',
		'--color-mid': '#4f23d7',
		'--color-dark': '#011627',
		'--color-highlight': '#ffd70e',
		'--shadow-drop': 'drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.5))',
		'--shadow-top': '0px 2px 4px 0 rgba(0, 0, 0, 0.2), 0px -4px 10px 0px rgba(0, 0, 0, 0.2)',
	}

	setTheme(theme)

	if(storage !== 'object'){ 
		localStorage.setItem('theme', JSON.stringify(theme))
	}

}
*/