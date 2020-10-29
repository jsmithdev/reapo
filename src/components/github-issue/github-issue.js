'use strict()'

import { 
    anchorLinksInText, 
} from '../../scripts/ux-util.mjs'

export class GithubIssue extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
        this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'github-issue'
	}

	static get observedAttributes() {
		return ['issue']
    }

    get issue(){
        return this._issue
    }
    set issue(value){
        console.log(value)
        const issue = JSON.parse(value)
        this._issue = {
            ...issue
        }
    }

	attributeChangedCallback(n, ov, nv) {
        console.log(n)
        this[n] = nv
    }

	connectedCallback() {

		this.shadowRoot.appendChild(this.template.content.cloneNode(true))
		this.registerElements()
	}

	registerElements() {

		this.dom = {
			edit: this.shadowRoot.querySelector('.edit'),
			view: this.shadowRoot.querySelector('.view'),
			edit_button: this.shadowRoot.querySelector('.edit_button'),
			view_button: this.shadowRoot.querySelector('.view_button'),
			save: this.shadowRoot.querySelector('reapo-button'),
		}

		this.setupElements()
	}
    
	setupElements() {

		this.registerListeners()
	}

	registerListeners() {

        this.dom.edit_button.onclick = event => this.show(event.target.classList.contains('edit_button'))

        this.dom.view_button.onclick = event => this.show(event.target.classList.contains('edit_button'))

        this.dom.save.onclick = event => {
            console.log('SAVE')
        }
    }
    
    show( show_edit ){
        
        if(show_edit){
            this.dom.view.classList.add('hidden')
            this.dom.edit.classList.remove('hidden')
            return 
        }
        this.dom.edit.classList.add('hidden')
        this.dom.view.classList.remove('hidden')
    }

	/* Clear inputs & Close */
	clear() {
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
    }
    
    get template(){

        const template = document.createElement('template')
        template.innerHTML = /*html*/`
        ${this.css}

        <div class="container">
            ${this.issueInfo}
        </div>
        `

        return template
    }
    get css(){
        return /* html */`
            <style>
                div.container {
                    padding: 0.8rem;
                }
                h2 { 
                    margin-block-end: 0px;
                }
                h2>a {
                    text-decoration: none;
                    color: var(--color-light);
                }
                pre {
                    white-space: break-spaces;
                }
                pre a {
                    color: var(--color-accent);
                }
                input, textarea {
                    width: 75vw;
                }
                reapo-button {
                    margin-left: 65vw;
                }
                svg {
                    cursor: pointer;
                    width: 2rem;
                    fill: var(--color-light);
                }
                svg.edit_button {
                    fill: var(--color-accent);
                }
                .hidden {
                    display:none;
                }
            </style>
        `
    }
    get issueInfo(){

        const body = anchorLinksInText(this.issue.body)

        return /* html */`
        <div class="view">
            <h2>
                <a name="title" title="Open in browser" href="${this.issue.url}">
                    ${this.issue.title}
                </a>
                <span>
                    <svg class="edit_button" viewBox="0 0 24 24">
                        <path class="edit_button" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                    </svg>
                </span>
            </h2>
                <span>
                    ${this.issue.date}
                </span>
            <pre>
                ${body}
            </pre>
            <br/>
        </div>


        <div class="edit hidden">
            <h2>
                <input name="title" value="${this.issue.title}" />
                <span>
                    <svg class="view_button" viewBox="0 0 24 24">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </span>
            </h2>
            <textarea name="body" rows="15">
                ${this.issue.body}
            </textarea>
            <br/>
            <reapo-button 
                label="Update"
            ></reapo-button>
            <br/>
        </div>
        `;
    }
}

customElements.define(GithubIssue.is, GithubIssue)
