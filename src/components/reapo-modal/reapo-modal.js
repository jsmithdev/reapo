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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999
}

.modal {
  padding: 20px 30px;
  width: 90%;
  max-height: calc(100% - 150px);
  overflow-y: scroll;
  position: relative;
  min-height: 300px;
  margin: 5% auto 0;
  background: #fff;
  z-index: 9999;
}

</style>
<body>
    <div class="is-hidden modal-overlay">
        <div class="d">
            bleep bloop
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
        //console.log('hi from constructor')
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
            modal: doc.querySelector('.modal'),
            overlay: doc.querySelector('.overlay')
        }
	    
		this.registerListeners()
    }
	registerListeners(){

        this.dom.overlay.addEventListener('click', e => {
            if (e.srcElement.id === this.overlay.id) {
                this.close()
            }
        })
        //this.dom.save.onclick = () => {
        //    console.log('CLICK ', this.dom.name.value)
        //}
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
customElements.define(ReapoModal.is, ReapoModal);