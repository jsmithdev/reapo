// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

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

.card {
    width: 95%;
    opacity: .9;
    z-index: 20;
    height: 50%;
    margin: auto 0;
    text-align: left;
    background: #FFF;
    position: relative;
    border-radius: 0px;
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
    position: absolute;
    bottom: 0;
    border-radius: 5px;
}

.terminal-log::-webkit-scrollbar {
	width: .25em;
}

.terminal-log::-webkit-scrollbar-track {
	background: #eee;
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.terminal-log::-webkit-scrollbar-thumb {
	background-color: #ec00ff;
	outline: 1px solid #525252;
}
</style>

<body>
    <div class="is-hidden modal-overlay">
        <div class="card">
            <h3 class="title"></h3>
            <br />
            <div class="actions">
                <div>
                    <div id="sync" class="action">
                    <svg class="icon_small" viewBox="0 0 24 24">
                        <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                    </svg>
                    &nbsp; Git Status
                    </div>
                </div>
                <div id="remove">
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="#4f23d7" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                </div>
            </div>
            <footer class="terminal-log"></footer>
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

//export class ReapoModal extends HTMLElement {
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
            remove: doc.querySelector('#remove')
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
        
        this.dom.sync.onclick = e => new Promise(res => 
            this.dispatchEvent(new CustomEvent(
                `exec-modal`, 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        res,
                        cmd: `git status`,
                        cwd: this.path+'/'+this.name
                    }
                })
            )
        )
        .then((res, e) => {
            console.log('got a RESPONSE... kinda!')
            console.dir(res)
            console.dir(e)
            this.dom.log.innerHTML += this.cleanStatus(res)+'\n\n' // 
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
            if(this.caller != detail.from){
                while(this.dom.log.lastChild){
                    this.dom.removeChild(this.dom.log.lastChild)
                }
            }
            this.caller = detail.from
            this.dom.title.textContent = detail.title
            this.path = detail.path
            this.name = detail.name
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