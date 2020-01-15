'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

svg {
	fill: var(--color-light);
	margin: 0.4rem;
	/* transform: rotate(0deg); */
    /* transition-duration: 1s; */
}
svg:hover {
	filter: var(--shadow-drop);
	transform: rotate(1800deg);
	transition-duration: 6s;
}

.header {
	width: 100%;
    /* position: fixed; */
    display: grid;
    grid-area: header;
    align-items: center;
    justify-items: center;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    padding: .25rem;
    background: var(--color-dark);
    border-bottom: 1pt solid var(--color-light);
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.35), 0px -4px 10px 0px rgba(0, 0, 0, 0.35);
}

.leftHeader {
	width: 100%;

    display: grid;
	align-items: center;
    justify-items: center;
	grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
}

.center {
	text-align: center;
}

/* todo make header a web component <reapo-header/> */
/* Header */
#menu {
	width: 100%;
	margin: auto;
	max-width: 3rem;
	cursor: pointer;
	border-radius: 50%;
	text-align: right;
}

.center {
	text-align: center;
}

.right {
	text-align: right;
}

.left {
	text-align: left;
}

.filter {
	width: 20%;
	border: none;
	padding: .3rem;
	max-width: 20rem;
	min-width: 12rem;
	text-align: center;
	border-radius: 5px;
	background: var(--color-lightest);
}

.refreshReapo {
	width: 100%;
    margin: auto;
    max-width: 3rem;
    cursor: pointer;
    border-radius: 50%;
    text-align: right;
}

</style>


<div class="header center">

	<div class="leftHeader">
		<div class="refreshReapo">
			<svg viewBox="0 0 24 24" title="Refresh Directory">
				<path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
			</svg>
		</div>

		<reapo-sort></reapo-sort>
	</div>

	<input type="text" class="filter" placeholder="Filter" autofocus />

	<div id="menu">
		<reapo-menu></reapo-menu>
	</div>

</div>
`

export class ReapoHeader extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'reapo-header'
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

			filter: doc.querySelector('input.filter'),
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

customElements.define(ReapoHeader.is, ReapoHeader)
