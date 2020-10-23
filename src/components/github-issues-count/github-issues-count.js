/*
* Use tag to import via es6 module (html import deprecated in v1 spec :/ )
* <script type="module" src="../components/github-issues-count/github-issues-count.js"></script>
*/
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.icon_small {
    margin: 2px;
    vertical-align: middle;
    fill: var(--color-light);
}
</style>


<svg class="icon_small no_data" viewBox="0 0 24 24">
    <path d="M19 12V13.5C21.21 13.5 23 15.29 23 17.5C23 18.32 22.75 19.08 22.33 19.71L21.24 18.62C21.41 18.28 21.5 17.9 21.5 17.5C21.5 16.12 20.38 15 19 15V16.5L16.75 14.25L16.72 14.22C16.78 14.17 16.85 14.13 19 12M19 23V21.5C16.79 21.5 15 19.71 15 17.5C15 16.68 15.25 15.92 15.67 15.29L16.76 16.38C16.59 16.72 16.5 17.1 16.5 17.5C16.5 18.88 17.62 20 19 20V18.5L21.25 20.75L21.28 20.78C21.22 20.83 21.15 20.87 19 23M13.03 18H6C3.79 18 2 16.21 2 14S3.79 10 6 10H6.71C7.37 7.69 9.5 6 12 6C15 6 17.4 8.37 17.5 11.32C18.12 11.11 18.8 11 19.5 11C20.78 11 21.97 11.38 23 12C22.13 10.9 20.84 10.14 19.35 10.03C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.03C2.34 8.36 0 10.9 0 14C0 17.31 2.69 20 6 20H13.5C13.24 19.38 13.08 18.7 13.03 18Z" />
</svg>

`

export class GithubIssuesCount extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
	
    static get is() {
        return 'github-issues-count'
    }

    static get observedAttributes() {
        return ['repo']
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
	
    registerElements(doc){
        //console.log('registerElements')
        
        this.dom = {
            no_data: doc.querySelector('.no_data'),
        }
	    
		this.registerListeners()
    }
	
	registerListeners(){
	
        this.dom.no_data.onclick = () => {

            const todo = `
            - if clicked and no data
                - get repo
                - get username
                - get auth token
                - get issues
                - save localStorage
                - show number of issues as icon
            - if clicked and has data
                - open modal with issues listed
            `
            console.log('todo')
            console.log(todo)


        }
	}
	
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'attr name that changed!':
        //        ov !== nv // old val not equal new val
        //        break;
        //}
    }
}

customElements.define(GithubIssuesCount.is, GithubIssuesCount)
