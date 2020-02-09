'use strict()'

const HELP_TEXT = 'Used to set the main directory of your projects that will show in the main view'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

	svg {
        height: fit-content;
        cursor: pointer;
    }
    path {
        fill: var(--color-lightest);
    }

	select {
		cursor: pointer;
		border: none;
		height: 1.75rem;
	}
	select:focus {
		outline-color: var(--color-dark);
	}


    .help {
        font-size: 0.7rem;
        background: var(--color-highlight);
        color: var(--color-dark);
        border: 1pt solid var(--color-mid);
        width: 1em;
        height: 1em;
        padding-left: .25rem;
        padding-right: .25rem;
        vertical-align: super;
        cursor: help;
        border-radius: 10px;
        padding: .1rem .25rem;
    }
    

	div.container {
		text-align: left;
    	padding-left: 1rem;
	}
    .title {
        background: var(--color-dark);
        color: white;
        border-radius: 5px 5px 0 0;
        margin: 0;    
        height: 3rem;
        padding-top: 1rem;
    }

    .action {
        height: auto;
        border-radius: 0 0 5px 5px;
        cursor: pointer;
    }
    .action input {
		-webkit-appearance: none;
		cursor: text;
		margin-left: -1rem;
		padding-left: .3rem;
		border-width: 0px;
		height: 1.75rem;
		outline-color: var(--color-dark);
	}

	div.pseudo {
		color: white;
		background: var(--color-mid);
		width: fit-content;
		padding: 1rem;
		border-radius: 5px;
	}
	div.pseudo:hover {
		background: #4f23d78a;
	}

</style>

<div class="container">

    <h2 class="title">Directory <span class="help" title="${HELP_TEXT}">?</span></h2>
    
	<div class="action" title="Set your main directory 🦄">
	
		<div class="pseudo"> Select Main Directory</div>
        
		<input 
			hidden
			type="file" 
			webkitdirectory directory 
			id="path" 
			class="text"
			placeholder="Eg: /home/user/repo ">
		</input>

    </div>
</div>
`

export class ReapoDir extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'reapo-dir'
	}

	static get observedAttributes() {
		return []
	}

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}

	//attributeChangedCallback(n, ov, nv) { }


	registerElements(doc) {

		this.dom = {

			action: doc.querySelector('.action'),
			path: doc.querySelector('#path'),
			pseudo: doc.querySelector('.pseudo'),
			help: doc.querySelector('.help'),
		}

		this.registerListeners()
	}

	registerListeners() {

		/* pseudo button triggers directory input */
		this.dom.pseudo.onclick = () => {
			this.dom.path.click()
		}

		/* Save Main Directory */
		//this.dom.action.onclick = () => saveMainDirectory()

		/* If Enter is pressed in input, trigger click */
		this.dom.path.onchange = async event => {
			if(event.target.files.length){

				const { path } = event.target.files[0]

				const message = await this.saveMainDirectory( path )

				this.dom.help.title = HELP_TEXT + '\n Current: '+path

				this.clear()

				this.toast(message)
			}
		}

		this.init()
	}

	init(){
		if(localStorage.path){
			this.dom.help.title = HELP_TEXT + '\n Current: '+localStorage.path
		}
	}

	/* Clear inputs & Close */
	clear() {

		this.dispatchEvent(
			new CustomEvent('close-settings', {
				bubbles: true,
				composed: true
			})
		)

		this.dom.path.value = ''
	}

		
	/* Save Main Directory */
	async saveMainDirectory( path ){
		
		console.log('Saving path: '+path)

		localStorage.setItem('path', path)

		return new Promise(res => {

			this.dispatchEvent(
				new CustomEvent(
					'save-settings',
					{
						bubbles: true,
						composed: true,
						detail: { res, path }
					}
				)
			)
		})
	}

	toast(msg, res = () => {}) {
		
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

customElements.define(ReapoDir.is, ReapoDir)