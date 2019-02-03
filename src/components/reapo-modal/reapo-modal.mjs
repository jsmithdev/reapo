// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const ipcRenderer = require('electron').ipcRenderer

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
    padding-top: 15%;
}

.modal {
  padding: 20px 30px;
  width: 90%;
  overflow-y: scroll;
  position: relative;
  min-height: 300px;
  margin: 5% auto 0;
  background: #fff;
  z-index: 9999;
}
.card {
    width: 95%;
    top: 250px;
    opacity: .9;
    z-index: 20;
    height: 50%;
    margin: auto 0;
    text-align: left;
    border-radius: 2px;
    background: #FFF;
    display: inline-block;
    max-height: calc(100% - 150px);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.card:hover {
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.22);
}

.title {
    padding: 1rem;
}

.icon_small {
    margin: 2px;
    width: 2rem;
    cursor: pointer;
    height: auto;
    fill: #525252;
    vertical-align: middle;
}

.action {
    width: 7.5rem;
    cursor: pointer;
    background: lightblue;
    border-radius: 5px;
    padding: .5rem;
    margin: 1rem;
}
.terminal-log {
    background: #525252;
    color: white;
    width: 100%;
    height: 10rem;
    overflow-y: scroll;
}
</style>
<body>
    <div class="is-hidden modal-overlay">
        <div class="card">
            <h3 class="title"></h3>
            <br />
            <div class="actions">
                <div id="sync" class="action">
                <svg class="icon_small" viewBox="0 0 24 24">
                    <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                </svg>
                &nbsp; Git Status
                </div>
            </div>
            <div class="terminal-log"></div>
        </div>
    </div>
</body>`

/* class Modal {
    constructor(overlay) {
      this.overlay = overlay;
      const closeButton = overlay.querySelector('.button-close')
      closeButton.addEventListener('click', this.close.bind(this));
      overlay.addEventListener('click', e => {
        if (e.srcElement.id === this.overlay.id) {
          this.close();
        }
      });
    }
    
  } */

export class ReapoModal extends HTMLElement {

    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'reapo-modal'
    }

    static get observedAttributes() {
        return ['projects']
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
            title: doc.querySelector('.title')
        }
	    
		this.registerListeners()
    }
	registerListeners(){

        this.dom.overlay.onclick = e => {
            if (e.target == this.dom.overlay) {
                this.close()
            }
        }
        
        this.dom.sync.onclick = e => new Promise(res => 
            this.dispatchEvent(new CustomEvent(
                `exec-modal`, 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        res,
                        cmd: `git status`,
                        cwd: this.path
                    }
                })
            )
        )
        .then(x => {
            console.log('got a RESPONSE... kinda!')
            console.dir(x)
            this.dom.log.textContent = `${this.dom.log.textContent}\n ${x}\n`
        })
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

    open(detail){
        if(detail){
            this.caller = detail.from
            this.dom.title.textContent = detail.name
            this.path = detail.path
        }
        
        this.dom.overlay.classList.remove('is-hidden')
    }
    close(){
        this.dom.overlay.classList.add('is-hidden')
    }
}
customElements.define(ReapoModal.is, ReapoModal);