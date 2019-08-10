// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

*,
*:before,
*:after {
  box-sizing: inherit;
}

html {
  min-height: 100%;
  max-height: 100%;
  box-sizing: border-box;
}


body {
    margin: 64px auto;
    max-width: 640px;
    width: 94%;
    max-height: 100%;
    text-align: center;
    
    max-width: 650px;
    line-height: 1.6;
    font-size: 18px;
    color: #444;
    padding: 0 10px
}

:host ::-webkit-scrollbar {
	width: .25em;
}

:host ::-webkit-scrollbar-track {
	background: var(--color-lightest);
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

:host ::-webkit-scrollbar-thumb {
	background-color: var(--color-light);
	outline: 1px solid #525252;
}

.is-hidden {
  display: none;
}

.modal-overlay {
    left: 0;
    top: 0px;
    z-index: 99;
    width: 100%;
    z-index: 99;
    height: 100%;
    overflow: auto;
    position: fixed;
    max-height: 100%;
    vertical-align: middle;
    background: rgba(0, 0, 0, 0.6);
}

.content {
    height: 100%;
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
}

.title {
    padding: 1rem;
    padding: 0;
    margin: 0 0 3px 0px;
}

.container {
}

.icon_small {
    margin: 2px;
    width: 2rem;
    cursor: pointer;
    height: auto;
    fill: #525252;
    vertical-align: middle;
}
.text {
    color: white;
    border: none;
    outline: none;
    background: transparent;
    border-bottom: 1pt solid pink;
}

.subtitle {
    background: var(--color-dark);
    color: white;
    text-align: center;
    border-radius: 5px 5px 0 0;
    margin: 0;
    height: 4rem;
    padding-top: 5px;
}

.close {
    color: var(--color-dark);
    font-size: 4rem;
    border: 3pt solid #3a208e;
    /* float: right; */
    /* margin: 5rem; */
    position: fixed;
    right: 40px;
    height: auto;
    width: 5rem;
    text-align: center;
    border-radius: 5rem;
    background: var(--color-lightest);
    cursor: pointer;
    z-index: 9000;
    user-select: none;
}

</style>

<body>

    <div class="is-hidden modal-overlay">

        <h1 class="close">X</h1>

        <div class="content">

            <div class="container">
                <reapo-create></reapo-create>
            </div>

            <div class="container">
                <reapo-dir></reapo-dir>
            </div>
        
            <!-- 
            <div class="container">
                <reapo-theme></reapo-theme>
            </div>
            -->
        </div>
    </div>
</body>`

export class ReapoSettings extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'reapo-settings'
	}

	static get observedAttributes() {
		return []
	}

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}

	//attributeChangedCallback(n, ov, nv){ }

	registerElements(doc) {

		this.dom = {

			modal: doc.querySelector('.modal'),
			close: doc.querySelector('.close'),
			overlay: doc.querySelector('.modal-overlay'),
			create: doc.querySelector('reapo-create'),
		}

		this.registerListeners()
	}

	registerListeners() {

		/* Close Settings */
		[this.dom.overlay, this.dom.close].map(el => el.onclick = e => {

			e.cancelBubble = true
            
			if (e.target === el) {
				this.close()
			}
		})

		this.dom.create.addEventListener('close-settings', () => this.close())
	}

	open() {
		this.dom.overlay.classList.remove('is-hidden')
		this.dom.create.focus()
	}

	close() {
		this.dom.overlay.classList.add('is-hidden')
	}

	toast(msg, res){
		this.dispatchEvent(
			new CustomEvent(
				'toast',
				{
					bubbles: true,
					composed: true,
					detail: { msg, res }
				}
			)
		)
	}
}

customElements.define(ReapoSettings.is, ReapoSettings)
