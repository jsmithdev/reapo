'use strict()'

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

	div {
		text-align: left;
    	padding-left: 1rem;
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

</style>

<div>

    <h2 class="title">Directory <span class="help" title="Used to set the main directory of your projects that will show in the main view">?</span></h2>
    
    <div class="action" title="Set your main directory 🦄">
        
        <input id="path" class="text" placeholder="Eg: /home/jamie/repo"/>

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
		}

		this.dom.path.value = localStorage.path ? localStorage.path : ''

		this.registerListeners()
	}

	registerListeners() {

		/* Save Main Directory */
		this.dom.action.onclick = () => new Promise(res => {

			const val = this.dom.path.value

			if (!val || val == localStorage.path || val + '/' == localStorage.path) { return }

			const path = val.slice(val.length - 1) == '/' ? val : `${val}/`
			console.log('sve '+path)
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
		.then(msg => {
			
			this.clear()

			this.dispatchEvent(
				new CustomEvent(
					'toast',
					{
						bubbles: true,
						composed: true,
						detail: { msg }
					}
				)
			)
		})

		/* If Enter is pressed in input, trigger click */
		this.dom.path.onkeyup = e => this.codes.action.includes(e.code) ? this.dom.path.click() : null
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
