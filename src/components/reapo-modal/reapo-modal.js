// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

import reapoTerminal from '../reapo-terminal/reapo-terminal' 

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>
body {
  /*margin: 40px auto;*/
  max-width: 650px;
  line-height: 1.6;
  font-size: 18px;
  color: #444;
  padding: 0 10px
}

.is-hidden {
  display: none;
}

.button-close {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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
    z-index: 9999;
    padding-top: 12.5%;
}

.card {
    width: 95%;
    opacity: .9;
    z-index: 20;
    height: 65%;
    margin: auto 0;
    text-align: left;
    background: #011627;
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


.container {
    padding:0 .5rem 0 .5rem;
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 1fr;
}
.actions {
    color: #FFF;
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
}
path {
    fill: "#4f23d7";
}

.title {
    color: white;
    padding: 1rem;
    width: 100%;
    text-align: left;
    text-decoration: underline;
    
    font-size: 1.2rem;
}

.icon_small {
    width: 1.8rem;
    cursor: pointer;
    fill: #ec00ff;
}


</style>

<body>
    <div class="is-hidden modal-overlay">
        <div class="card">

            <div class="container">

                <h3 class="title"></h3>

                <div class="actions">
                
                    <div id="sync" title="Git Status">
                        <svg class="icon_small" viewBox="0 0 24 24">
                            <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                        </svg>
                    </div>

                    <div id="remove" title="Delete">
                        <svg class="icon_small" viewBox="0 0 24 24"><!-- style="width:24px;height:24px" viewBox="0 0 24 24" -->
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                    </div>

                    <div>
                        <u>Last Modified</u>
                        <pre class="moddate"></pre>
                    </div>

                </div>
            </div>

            <reapo-terminal></reapo-terminal>

        </div>
    </div>
</body>`

class ReapoModal extends HTMLElement {

    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'reapo-modal'
    }

    static get observedAttributes() {
        return []
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){
        //console.log('registerElements')
        
        this.dom = {
            sync: doc.querySelector('#sync'),
            modal: doc.querySelector('.modal'),
            log: doc.querySelector('.terminal-log'),
            overlay: doc.querySelector('.modal-overlay'),
            title: doc.querySelector('.title'),
            remove: doc.querySelector('#remove'),
            term: doc.querySelector('reapo-terminal'),
            moddate: doc.querySelector('.moddate'),
        }
	    
		this.registerListeners()
    }
	registerListeners(){
        
        /* Close Modal */
        this.dom.overlay.onclick = e => {
            if (e.target == this.dom.overlay) {
                this.close()
            }
        }
        
        /* Delete Repo */
        this.dom.remove.onclick = e => {

            const name = this.name
            
            if(!confirm(`For reals, you wanna trash ${name}?`)){ return }

            this.dispatchEvent(
                new CustomEvent(
                    `delete-repo`,
                    {
                        bubbles: true,
                        composed: true,
                        detail: { name }
                    }
                )
            )
        }
        
        this.dom.sync.onclick = e => new Promise((res, rej) => 
            this.dispatchEvent(new CustomEvent(
                `exec-modal`, 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        chain: { res, rej },
                        cmd: `git status`,
                        cwd: this.path+'/'+this.name
                    }
                })
            )
        )
        .then(res => this.dom.term.setAttribute('log', res))
        .catch(res => this.dom.term.setAttribute('log', res))
	}
	
    attributeChangedCallback(n, ov, nv) {  }

    open(detail){

        if(detail){
            if(this.caller != detail.from){
                while(this.dom.log.lastChild){
                    this.dom.removeChild(this.dom.log.lastChild)
                }
            }
            this.caller = detail.from
            this.dom.title.textContent = detail.name
            this.dom.moddate.textContent = detail.moddate

            this.path = detail.path
            this.name = detail.name
            //moddate
            this.dom.term.path = this.path
            this.dom.term.name = this.name
            this.dom.term.setAttribute('focus', true)
        }
        
        this.dom.overlay.classList.remove('is-hidden')
    }

    close(){
        this.dom.overlay.classList.add('is-hidden')
    }

    cleanStatus(str){
        return str
        .replace(/</gi, `:`)
        .replace(/>/gi, `:`)
        .replace(/master'./, `baster'.<br/>`)
        .replace(/modified: /g, `modified: <br/>`)
    }
}
customElements.define(ReapoModal.is, ReapoModal)


module.exports = ReapoModal