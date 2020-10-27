/*
* Use tag to import via es6 module (html import deprecated in v1 spec :/ )
* <script type="module" src="../components/github-issues-count/github-issues-count.js"></script>
*/
'use strict()'

export class GithubIssuesCount extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
	
    static get is() {
        return 'github-issues-count'
    }

    static get observedAttributes() {
        return ['git', 'repo', 'issues']
    }

    get count(){
        return this.issues.length ? this.issues.length : 0
    }

    get template(){
        return this.getTemplate()
    }

    get issues(){ 
        return typeof this._issues === 'string' 
            ? JSON.parse(this._issues)
            : this._issues
    }
    set issues(value){

        const data = JSON.parse(value)

        if(!data?.length){
            this._issues = []
            return this.setupHasNoIssues() 
        }
        
        if(!this._issues){ 

            this._issues = data
            
            return this.setupHasIssues() 
        }

        this._issues = data
    }
    get issueRows(){

        if(!this.issues.length){return ''}

        const rows = this.issues.map(issue => {

            return `
                <h2><a href="${issue.url}">${issue.title}</a></h2>
                <pre title="${issue.date}">${issue.body}</pre>
                <br/>
            `
        }).join('')
        
        return rows ? rows : ''
    }

    connectedCallback() {

        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
	
    registerElements(doc){
        
        this.dom = {
            no_git: doc.querySelector('.no_git'),
            no_data: doc.querySelector('.no_data'),
        }
        
        this.setup()
    }

    setup(){
        
        if(this.git){
            this.dom.no_git.classList.add('hidden')
            this.dom.no_data.classList.remove('hidden')
        }
        else {
            this.dom.no_git.classList.remove('hidden')
            this.dom.no_data.classList.add('hidden')
        }

		this.registerListeners()
    }
	
	registerListeners(){

        this.dom.no_git.onclick = () => this.toast('Project is not a git repo...')
	
        this.dom.no_data.onclick = () => {

            this.dispatchEvent(new CustomEvent('get-issues', {
                detail: {
					bubbles: true,
					composed: true,
                    repo: this.repo,
                }
            }))
        }
    }
    
    //  this.toast('todo :unicorn:')
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
    
    attributeChangedCallback(n, ov, nv) {
        
        this[n] = nv
    }



    openLink(url){
        console.log('url =>')
        console.log(url)
    }

    addModal(){
        const div = document.createElement( 'div' )
        div.innerHTML = /* html */`
        <modal-component
            header="default"
            body-align="left"
            body-color="${document.documentElement.style.getPropertyValue('--color-lightest')}"
            body-border="${document.documentElement.style.getPropertyValue('--color-dark')}"
            body-background="${document.documentElement.style.getPropertyValue('--color-dark')}"
            footer-separator="${document.documentElement.style.getPropertyValue('--color-light')}"
            close-icon-color="${document.documentElement.style.getPropertyValue('--color-lightest')}">
        
            <span slot="trigger">
                <div class="has_data hidden"></div>
            </span>
        
            <span slot="header">
                ${this.repo?.substring(this.repo.lastIndexOf('/')+1, this.repo.length)} Issues
            </span>
        
            <span slot="content">
                ${this.issueRows}
            </span>
        
            <span slot="footer">
                <reapo-button
                    name="close"
                    label="Close"
                    color="${document.documentElement.style.getPropertyValue('--color-lightest')}"
                    background="${document.documentElement.style.getPropertyValue('--color-dark')}"
                ></reapo-button>
            </span>
    
        </modal-component>
        `

        this.shadowRoot.appendChild( div )
    }

    setupHasIssues(){
        
        this.addModal()

        setTimeout(() => {

            this.dom.has_data = this.shadowRoot.querySelector('.has_data')

            const names = this.issues.map(x => x.title).join('\n')

            this.dom.has_data.textContent = this.count
            this.dom.has_data.title = `Repo has ${this.count} open issues:\n${names}`

            this.dom.no_data.classList.add('hidden')
            this.dom.has_data.classList.remove('hidden')
            this.shadowRoot.querySelector('modal-component').querySelector('reapo-button')
                .onclick = _ => this.shadowRoot.querySelector('modal-component').close()

            localStorage.setItem(`${this.repo}__issues`, JSON.stringify(this.issues))
        }, 0)
    }
    
    setupHasNoIssues(){
        
        this.addModal()

        setTimeout(() => {

            this.dom.has_data = this.shadowRoot.querySelector('.has_data')
            this.dom.has_data.onclick = this.toast('No issues :good:')
            this.dom.has_data.textContent = this.count
            this.dom.has_data.title = `Repo has ${this.count} open issues`

            this.dom.no_data.classList.add('hidden')
            this.dom.has_data.classList.remove('hidden')
            this.shadowRoot.querySelector('modal-component').querySelector('reapo-button')
                .onclick = _ => this.shadowRoot.querySelector('modal-component').close()

            localStorage.setItem(`${this.repo}__issues`, JSON.stringify(this.issues))
        }, 0)
    }

    getTemplate(){

        const template = document.createElement('template')

        template.innerHTML = /*html*/`
        
        <style>
            h2>a {
                color: var(--color-light)
            }
            .icon_small {
                margin: 2px;
                vertical-align: middle;
                fill: var(--color-light);
            }
            .hidden {
                display: none;
            }
            .has_data {
                border-radius: 50%;
                height: 2rem;
                width: 2rem;
                line-height: 2rem;
                color: var(--color-light);
                background: var(--color-dark);
            }
        </style>
        
        <div class="no_git" class="hidden" title="Project is not a git repo">
            <svg class="icon_small" title="Not a git repo" viewBox="0 0 24 24">
                <path d="M4,1C2.89,1 2,1.89 2,3V7C2,8.11 2.89,9 4,9H1V11H13V9H10C11.11,9 12,8.11 12,7V3C12,1.89 11.11,1 10,1H4M4,3H10V7H4V3M14,13C12.89,13 12,13.89 12,15V19C12,20.11 12.89,21 14,21H11V23H23V21H20C21.11,21 22,20.11 22,19V15C22,13.89 21.11,13 20,13H14M3.88,13.46L2.46,14.88L4.59,17L2.46,19.12L3.88,20.54L6,18.41L8.12,20.54L9.54,19.12L7.41,17L9.54,14.88L8.12,13.46L6,15.59L3.88,13.46M14,15H20V19H14V15Z" />
            </svg>
        </div>
        
        <div class="no_data" class="hidden" title="Project is a git repo, click to check issues">
            <svg class="icon_small " title="Click to get issues" viewBox="0 0 24 24">
                <path  d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z" />
            </svg>
        </div>
        `

        return template
    }
}

customElements.define(GithubIssuesCount.is, GithubIssuesCount)
