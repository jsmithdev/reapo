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
    max-width: 100%;
    min-height: 20rem;
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

<div class="is-hidden modal-overlay">
	<div class="card">

		<div class="colorContainer"></div>
		
		<color-picker color="#ee6f0a" theme="normal"></color-picker>

		<br />
		<button class="save">Save</button>
	</div>
</div>`

class ReapoTheme extends HTMLElement {

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
			overlay: doc.querySelector('.modal-overlay'),
			picker: doc.querySelector('color-picker'),
			colorContainer: doc.querySelector('.colorContainer'),
		}

		this.registerListeners()
	}
	registerListeners() {

		/* Close Modal */
		this.dom.overlay.onclick = e => {
			if (e.target == this.dom.overlay) {
				this.close()
			}
		}
		this.addEventListener(`close-${this.is}`, () => this.close())

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


	open(){
		this.dom.overlay.classList.remove('is-hidden')
	}

	close(){
		this.dom.overlay.classList.add('is-hidden')
	}
}
customElements.define(ReapoTheme.is, ReapoTheme)
module.exports = ReapoTheme
