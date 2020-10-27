'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

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

	div#submit {
		color: white;
		background: var(--color-mid);
		width: fit-content;
		padding: 1rem;
		border-radius: 5px;
        margin-left: -16px;
	}
	div#submit:hover {
		background: #4f23d78a;
	}
</style>

<div>

    <h2 class="title">GitHub <span class="help" title="To use GitHub issue feature, set your username and personal access token &#10;">?</span></h2>

    <div class="action" title="Set your GitHub info 🦄">
        
        <input id="user" placeholder="GitHub Username..." />
        <br />
        <input id="token" type="password" placeholder="GitHub Token..." />
        <br />
        <br />
		<div id="submit">Set GitHub Info</div>

    </div>
</div>
`// type="password"

export class GithubInfo extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'github-info'
	}

	static get observedAttributes() {
		return []
    }
    
    get user(){
        if(!this._user){
            return localStorage.getItem('user')
        }
        return this._user
    }
    set user(value){
        localStorage.setItem('user', value)
        this._user = value
    }
    get token(){
        if(!this._token){
            return localStorage.getItem('token')
        }
        return this._token
    }
    set token(value){
        localStorage.setItem('token', value)
        this._token = value
    }

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}

	//attributeChangedCallback(n, ov, nv) { }

	registerElements(doc) {

		this.dom = {
			user: doc.getElementById('user'),
			token: doc.getElementById('token'),
			submit: doc.getElementById('submit'),
		}

		this.setupElements()
	}
    
	setupElements() {

		if(this.user){
            this.dom.user.value = this.user
        }
		if(this.token){
            this.dom.token.value = this.token
        }

		this.registerListeners()
	}

	registerListeners() {

		/* On new click, create repo */
		this.dom.submit.onclick = event => {
            
			// If no info, no run
			if (!this.dom.user.value || !this.dom.token.value ){
                return this.toast('Fields missing :bad:')
            }

			const user = this.dom.user.value
			const token = this.dom.token.value
            const responder = this.toast

            this.user = user
            this.token = token

            this.dispatchEvent(
                new CustomEvent(
                    'github-info',
                    {
                        bubbles: true,
                        composed: true,
                        detail: {
                            user,
                            token,
                            responder,
                        }
                    }
                )
            )
            
            this.toast('Set git info :unicorn:')
		}

		/* If Enter is pressed in input, trigger new click */
		this.dom.token.onkeyup = e => this.codes.action.includes(e.code) ? this.dom.submit.click() : null
	}


	/* Clear inputs & Close */
	clear() {

		this.dom.user.value = ''
		this.dom.token.value = ''
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
		this.dom.user.focus()
	}
}

customElements.define(GithubInfo.is, GithubInfo)
