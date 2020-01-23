// jshint asi: true, esversion: 6, laxcomma: true 
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

    <h2 class="title">Create <span class="help" title="To make a blank new repo just type a name and hit Enter (or click addition icon) &#10;
    To make make a new repo from .git repo, put the full .git url instead of a name and hit Enter (or click addition icon) &#10;
    To create a Salesforce Project using SFDX, select option from drop down, type a new and hit Enter (or click addition icon) &#10;">?</span></h2>
    
    <select>
        <option>Normal</option>
        <option>Salesforce Project</option>
    </select>
    
    <div class="action" title="Give a name for a new repo or paste a .git uri 🦄">
        
        <input id="name" placeholder="Name of folder, project or .git URL" />
    </div>
</div>
`

export class ReapoCreate extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'reapo-create'
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

			select: doc.querySelector('select'),
			new: doc.querySelector('.action'),
			name: doc.querySelector('#name'),
		}

		this.registerListeners()
	}

	registerListeners() {

		/* On new click, create repo */
		this.dom.new.onclick = e => {
			// If no name, don't create
			if (e.target == this.dom.name) { return }

			const name = this.dom.name.value

			name ? this.createRepo(name, localStorage.path) : this.toast('Please enter a name or .git url') // jshint ignore: line
		}

		/* If Enter is pressed in input, trigger new click */
		this.dom.name.onkeyup = e => this.codes.action.includes(e.code) ? this.dom.new.click() : null
	}


	/* Clear inputs & Close */
	clear() {

		this.dom.name.value = ''
		this.dom.select.value = ''
		this.offsetParent.click()
	}

	/* Create a Repo */
	createRepo(input, path) {
		
		if (!path) {

			this.toast('Please set a Main Directory')
		}

		const isSfdx = this.dom.select.value.toLowerCase().includes('salesforce')

		const isGit = input.toLowerCase().includes('.git') && input.toLowerCase().includes('http')

		const name = isGit ? input.substring(input.lastIndexOf('/') + 1, input.lastIndexOf('.')) : input

		// make type
		const type = isSfdx ? 'new-sfdx'
			: isGit ? 'new-git'
				: 'new-repo'

		// make cmd
		const cmd = isSfdx ? `sfdx force:project:create --projectname ${name}`
			: isGit ? `git clone ${input}`
				: 'code '+name

		const cwd = localStorage.path

		const event = this.newEvent(type, cmd, cwd, name, path)

		this.dispatchEvent(event)

	}

	newEvent(type, cmd, cwd, name, path) {

		const exit = x => this.cleanup(x, name, path, cmd.includes('git'))

		return new CustomEvent(
			type,
			{
				bubbles: true,
				composed: true,
				detail: {
					name,
					path,
					cmd,
					cwd,
					exit,
					responder: () => loadRepo({clear: true})
				}
			}
		)
	}

	cleanup(x, name, path, open) {
		
		this.toast(x.length > 200 ? `${x.substring(0, 200)}...` : x)

		this.dispatchEvent(
			new CustomEvent(
				'refresh-repo',
				{
					bubbles: true,
					composed: true,
					detail: { clear: true }
				}
			)
		)

		this.dispatchEvent(
			new CustomEvent('close-settings', {
				bubbles: true,
				composed: true
			})
		)

		if (open && name && path) {

			this.dispatchEvent(new CustomEvent(
				'open-code',
				{
					bubbles: true,
					composed: true,
					detail: {
						from: this.is,
						title: name,
						cmd: 'code .',
						cwd: `${path}/${name}`
					}
				})
			)
		}
	}

	toast(msg, res) {
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

	focus(){
		this.dom.name.focus()
	}
}

customElements.define(ReapoCreate.is, ReapoCreate)
