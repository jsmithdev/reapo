'use strict()'


const codes = {
	find: ['KeyF'],
	exit: ['KeyW'],
	restart: ['KeyR'],
	close: ['Escape'],
	settings: ['KeyS', 'KeyN'],
}

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

svg {
	width: 100%;
	height: 42px;
	margin: 0.15rem;
	cursor: pointer;
	fill: var(--color-light);
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

.leftHeader, .rightHeader {
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

.refreshReapo > svg {
	transform: rotate(0deg);
	transition-duration: 3s;
}
.refreshReapo > svg:hover {
	/**filter: var(--shadow-drop); */
	transform: rotate(1800deg);
	transition-duration: 6s;
}


</style>


<div class="header center">

	<div class="leftHeader" title="Refresh Directory">
		<div class="refreshReapo">
			<svg viewBox="0 0 24 24">
				<path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
			</svg>
		</div>

		<reapo-sort></reapo-sort>
	</div>

	<div class="centerHeader">
		<input type="text" class="filter" placeholder="Filter" autofocus />
	</div>

	<div class="rightHeader">
		<div class="search" title="Search contents of files in all projects showing atm">
			<svg viewBox="0 0 24 24">
				<path d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M7,15V17H9C9.14,18.55 9.8,19.94 10.81,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19A2,2 0 0,1 21,5V13.03C19.85,11.21 17.82,10 15.5,10C14.23,10 13.04,10.37 12.04,11H7V13H10C9.64,13.6 9.34,14.28 9.17,15H7M17,9V7H7V9H17Z" />
			</svg>
		</div>
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
		this.registerElements()
	}

	//attributeChangedCallback(n, ov, nv) { }
	// `grep ${string} -F -r -l --exclude-dir={node_modules,.*} --exclude={.*} ${directory}`

	registerElements() {

		this.dom = {
			menu: this.shadowRoot.querySelector('reapo-menu'),
			sortDir: this.shadowRoot.querySelector('reapo-sort'),
			filter: this.shadowRoot.querySelector('input.filter'),
			search: this.shadowRoot.querySelector('div.search'),
			refreshReapo: this.shadowRoot.querySelector('.refreshReapo'),
		}

		this.registerListeners()
	}

	registerListeners() {
		
		/* search file contents */
		this.dom.search.onclick = () => {
			this.search()
		}
		
		/* refresh-directory */
		this.dom.refreshReapo.onclick = () => {
			this.loadRepo({ clear: true })
			toast(`Refreshed directory 🦄`)
		}
		
		/* filter */
		this.dom.filter.onkeyup = event => {
			this.dispatchEvent(new CustomEvent('filter', {
				bubbles: true,
				composed: true,
				detail: {
					value: event.target.value
				}
			}))
		}
	}

	settingListeners() { /* Settings Menu */

		
	}

	sortDirListeners() { /* Sort Projects */

		this.dom.sortDir.addEventListener('sort', event => {
	
			const { order } = event.detail
	
			localStorage.setItem('order', order)
	
			this.loadRepo({
				order,
				clear: true,
			})
		})
	}


	/* Clear inputs & Close */
	clear() {

		this.dom.name.value = ''
		this.dom.select.value = ''
		this.offsetParent.click()
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
		this.dom.filter.focus()
	}

	open(options){
		if(options.value == 'settings'){
			this.dom.menu.open()
		}
	}

	close(){
		this.dom.menu.close()
	}

	loadRepo(detail){

		detail.order ? detail.order : localStorage.getItem('order')
		
		this.dispatchEvent(
			new CustomEvent(
				'loadRepo',
				{
					bubbles: true,
					composed: true,
					detail,
				}
			)
		)
	}

	search(){
		
		this.dispatchEvent(
			new CustomEvent(
				'open-search',
				{
					bubbles: true,
					composed: true,
				}
			)
		)
	}
}

customElements.define(ReapoHeader.is, ReapoHeader)