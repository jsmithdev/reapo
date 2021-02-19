'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.is-hidden {
    display:none;
}

.modal-overlay {
    position: fixed;
    text-align: center;
    vertical-align: middle;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
    padding-top: 12.5%;
}

.card {
    padding: 1rem;
    color: var(--color-lightest);
    width: 95%;
    opacity: .9;
    z-index: 20;
    height: 65%;
    margin: auto 0;
    text-align: left;
    background: var(--color-dark);
    position: relative;
    border-radius: 0px;
    display: inline-block;
    max-height: calc(100% - 150px);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.16);
}
.card:hover {
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.22);
}
button {
    margin: 1rem 0;
    border: none;
    color: var(--color-lightest);
    padding: 1rem;
    border-radius: 5px;
    cursor: pointer;
    width: fit-content;
    background: var(--color-mid);
}
button:hover {
    opacity: .7;
}

div.results {
    height: 65%;
    overflow: auto;
}

div.results > div {
    cursor: pointer;
    width: fit-content;
    border-radius: 5px;
    padding: 5px 5px 5px 1px;
}
div.results > div:hover {
    background: gray;
}
</style>

<div class="is-hidden modal-overlay">
    <div class="card">
        <h3>Search repos for snippet</h3>
        <input class="value" placeholder="String to search..." />
        <br />
        <button class="search">Search</button>
        <button class="cancel">Cancel</button>
        <button class="clear">Clear</button>
        <br />
        <div class="results"></div>
    </div>
</div>`

export class SearchRepos extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'search-repos'
    }
    static get active() {
        console.log('get act')
        return this.active ? true : false
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }

    registerElements(doc){
        
        this.dom = {
			overlay: doc.querySelector('.modal-overlay'),
            string: doc.querySelector('input'),
            results: doc.querySelector('div.results'),
            search: doc.querySelector('button.search'),
            cancel: doc.querySelector('button.cancel'),
            clear: doc.querySelector('button.clear'),
        }
	    
		this.registerListeners()
    }

	registerListeners(){

		/* Close */
		this.dom.overlay.onclick = e => {
			if (e.target == this.dom.overlay) {
				this.close()
			}
		}
        this.addEventListener(`close-${this.is}`, this.close)
        
        /* Clear */
        this.dom.clear.onclick = () => this.clear()
        
        /* Cancel */
        this.dom.cancel.onclick = () => {

            this.searchEngaged = false
            
            this.dispatchEvent(new CustomEvent(
                'exec-cmd-cancel', 
                {
                    bubbles: true, 
                    composed: true,
                    responder: console.log,
                    exit: console.log,
                })
            )
        }
	
        this.dom.search.onclick = () => {

            this.searchEngaged = true
            this.clear()

            const string = this.dom.string.value

            this.dispatchEvent(new CustomEvent(
                'exec-cmd', 
                {
                    bubbles: true, 
                    composed: true,
                    detail: {
                        cmd: `grep ${string}  -Fr -r -l --exclude-dir={node_modules,.history,dist,deploy}`,
                        cwd: `${this.directory}`,
                        responder: response => {
                            if(this.searchEngaged){
                                this.handleResults(
                                    response, 
                                    this.dom.results.childNodes.length === 0 ? true : false
                                )
                            }
                        },
                        exit: this.searchFinished,
                    }
                }
            ))
        }
    }

    handleResults(string, isNew){

        console.log('NEW: '+isNew)

        const results = string.split('\n')

        console.log('results: '+results.length)

        if(isNew){

            const temp_last = results.pop()

            if(temp_last.indexOf(0) !== '/' && temp_last.indexOf(temp_last.length - 4)){
                this.temp_last = temp_last
            }

            console.log('this.temp_last: '+this.temp_last)
        }
        
        results.map((value, index) => {

            // grep shouldn't return anyway!
            if(value.includes('.history') || value.includes('node_modules')){
                return
            }

            if(index === results.length){
                this.temp_last = value
                return
            }

            if(index === 0 && this.temp_last){
                const merged = this.temp_last+value
                this.temp_last = undefined
                console.log('merged: '+merged)
                this.addValue(merged)
                return 
            }

            this.addValue(value)
            return 

        })
    }

    addValue(value){
        const div = document.createElement('div')
        div.onclick = () => {
            console.log('Click div: '+value)
            const repo = value.substring(0, value.indexOf('/'))
            const filepath = value.substring(value.indexOf('/'), value.length)
			this.dispatchEvent(new CustomEvent(
				'open-code', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						cmd: `code ${this.directory}/${repo} --goto ${this.directory}/${value}`, 
						cwd: `${this.directory}`
					}
				})
			)
        }
        const span = document.createElement('span')
        span.textContent = value
        div.appendChild(span)
        this.dom.results.appendChild(div)
    }

    searchFinished(results){
        console.log('searchFinished results')
        console.log(results)
    }
    
	open(detail){
        const { directory } = detail
        this.directory = directory
		this.dom.overlay.classList.remove('is-hidden')
	}

	close(){
		this.dom.overlay.classList.add('is-hidden')
	}

	clear(){
        while (this.dom.results.firstChild) {
            this.dom.results.removeChild(this.dom.results.lastChild)
        }
	}
}
customElements.define(SearchRepos.is, SearchRepos);