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
		this.registerListeners()
		this.init()
	}

	//attributeChangedCallback(n, ov, nv) { }


	registerElements(doc) {

		this.dom = {
			
			action: doc.querySelector('.action'),
			pseudo: doc.querySelector('.pseudo'),
			help: doc.querySelector('.help'),
		}
	}

	registerListeners() {

		this.dom.pseudo.addEventListener('click', () => {

			window.api.send("select-parent-directory", CONFIG.REPO_DIR);

			window.api.receive("select-parent-directory-res", directories => {
				this.directoryHandler(directories)
			})
		})
	}

	init(){
		if(localStorage.path){
			this.dom.help.title = HELP_TEXT + '\n Current: '+localStorage.path
		}
	}

	// Handle directory change
	directoryHandler(dirs){

		if( !dirs || dirs.length === 0 ){
			return console.warn('no dirs for directoryHandler')
		}

		const path = dirs[0]
		
		localStorage.setItem('path', path)

		this.clear()

		this.toast(`Set main directory to ${path}`)

		this.dom.help.title = HELP_TEXT + '\n Current: '+path

		this.loadRepo()
	}

	
	loadRepo(){

		const detail = {
			clear: true,
			order: localStorage.getItem('order') ? localStorage.getItem('order') : 'date-desc',
		}
		
		this.dispatchEvent(
			new CustomEvent(
				'load-repo',
				{
					bubbles: true,
					composed: true,
					detail,
				}
			)
		)
	}

	/* Clear inputs & Close */
	clear() {

		this.dispatchEvent(
			new CustomEvent('close-settings', {
				bubbles: true,
				composed: true
			})
		)
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