'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

.card {
	
    margin: 1rem;
    cursor: pointer;
    border-radius: 5px;
    background: var(--color-dark);
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
.card:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

.title {
	min-height: 1.75vw;
    user-select: none;
    cursor: pointer;
    color: var(--color-lightest);
    padding: 1rem;
    font-weight: inherit;
    word-break: break-word;
    line-height: 1;
    padding-top: 3rem;
}

.icon_small {
    margin: 2px;
    vertical-align: middle;
    fill: var(--color-light);
}
.actions {
	bottom: 0;
	height: 4.25vh;
    width: -webkit-fill-available;
    background: var(--color-mid);
    border-radius: 0px 0px 5px 5px;
    vertical-align: middle;
    box-shadow: 0 -3px 5px 0px rgba(0,0,0,0.12);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 2fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    justify-items: center;
    align-items: center;
}

.action {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    border-radius: 5px;
    bottom: 0;
}

.moddate {
    color: white;
    display: contents;
    font-size: .8rem;
}
</style>

<div class="card">
    <h3 class="title"></h3>
    <div class="actions">

        <div id="details" class="action" title="Details" tabindex="0">
            <svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,10L8,14H11V20H13V14H16M19,4H5C3.89,4 3,4.9 3,6V18A2,2 0 0,0 5,20H9V18H5V8H19V18H15V20H19A2,2 0 0,0 21,18V6A2,2 0 0,0 19,4Z" />
            </svg>
        </div>

        <div id="other" class="action" title="">
            <github-issues-count></github-issues-count>
        </div>

        <div id="code" class="action" title="Open in VS Code" tabindex="0">
            <svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
            </svg>
        </div>
        
    </div>
</div>`


export class ReapoFolder extends HTMLElement {

	constructor() {
		super()
        
		this.attachShadow({mode: 'open'})

		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.codes = {
			action: ['Space', 'Enter'],
		}
	}

	static get is() {
		return 'reapo-folder'
	}

	static get observedAttributes() {
		return ['title', 'path', 'name', 'date', 'git', 'issues']
	}

    set issues(value){
		this.dom.count.setAttribute('issues', value)
	}
	
	connectedCallback() {
        
		if(this.path && this.name && this.date){ 
			this.registerElements() 
		}
	}
	
	//attributeChangedCallback(n, ov, nv) { }

	/**
	 * @description Accumulate DOM Elements to be used
	 */
	registerElements(){

		this.dom = {
			
			code: this.shadowRoot.getElementById('code'),
			details: this.shadowRoot.getElementById('details'),

			card: this.shadowRoot.querySelector('.card'),
			title: this.shadowRoot.querySelector('.title'),
			moddate: this.shadowRoot.querySelector('.moddate'),
			count: this.shadowRoot.querySelector('github-issues-count'),
		}

		/* Folder Name */
		this.dom.title.textContent = this.name

		/* Surface Modified Date */
		this.moddate = new Intl
			.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			})
			.format(new Date(this.date))

		this.title = `${this.name} \n Last Modified: ${this.moddate}`

		this.registerListeners()
	}

	registerListeners(){

		/* Listen if user wants to key the action */
		this.setKeyupAction(this.dom.code)
		
		/* Listen if user wants to key the action */
		this.setKeyupAction(this.dom.details)

		/* Listen top/title click open details */
		this.dom.title.onclick = this.dom.details.onclick

		/* Open in VS Code */
		this.dom.code.onclick = () => {

			this.dispatchEvent(new CustomEvent(
				'open-code', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						from: this.is,
						title: this.name,
						cmd: 'code .', 
						cwd: `${this.path}/${this.name}`
					}
				})
			)
		}

		/* Show details about repo */
		this.dom.details.onclick = () => {

			this.dispatchEvent(new CustomEvent(
				'open-details', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						from: this.is,
						name: this.name, 
						moddate: this.moddate, 
						title: this.title, 
						path: this.path
					}
				})
			)
		}


		if(this.git){
			this.dom.count.setAttribute('git', 'true')
			this.dom.count.setAttribute('repo', `${this.path}/${this.name}`)
			this.dom.count.addEventListener('get-issues', event => {
				
				const { repo } = event.detail

				this.dispatchEvent(new CustomEvent('get-issues', {
					detail: {
						bubbles: true,
						composed: true,
						repo: repo,
					}
				}))
			})
		}
	}

	/**
	 * @description Set keyup listener
	 * 
	 * @param {Element} el 
	 */
	setKeyupAction(el){
		
		el.addEventListener('keydown', e => {

			if( this.codes.action.includes(e.code) ){
				e.preventDefault()
				e.target.onclick(e)
			}
		})
	}
}

customElements.define(ReapoFolder.is, ReapoFolder)
