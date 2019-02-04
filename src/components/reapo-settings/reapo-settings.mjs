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

.card {
    opacity: .9;
    z-index: 20;
    margin: auto 0;
    text-align: center;
    background: #FFF;
    position: relative;
    display: inline-block;
    max-height: calc(100% - 150px);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    width: 50%;
    height: 0;
    padding-bottom: 50%;
    border-radius: 50%;
}
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
.text {
    border: none;
    border-bottom: 1pt solid pink;
}
#save {
    margin-top: 2rem;
    cursor: pointer;
    background: #4f23d7;
    color: white;
    border: 1pt solid #4f23d7;
    padding: .5rem 1rem;
    border-radius: 5px;
}

body::-webkit-scrollbar {
	width: .25em;
}

body::-webkit-scrollbar-track {
	background: #eee;
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

body::-webkit-scrollbar-thumb {
	background-color: #ec00ff;
	outline: 1px solid #525252;
}

.container {
    margin: 0 auto;
    display: inline-block;
    vertical-align: bottom;
    height: 200px;
    width: 100%;
    padding-top: 20%;
}
</style>

<body>
    <div class="is-hidden modal-overlay">
        <div class="card">
            <h3 class="title">Settings</h3>
            <div class="container">
                <div class="inputs">
                    <label for="path">Path to a Repo</label>
                    <br/>
                    <input id="path" class="text" placeholder="Eg: /home/jamie/repo"/>
                    <br/>
                </div>
                <button id="save">Save</button>
            </div>
        </div>
    </div>
</body>`

export class ReapoSettings extends HTMLElement {

    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'reapo-settings'
    }

    static get observedAttributes() {
        return ['projects']
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){

        this.dom = {
            sync: doc.querySelector('#sync'),
            modal: doc.querySelector('.modal'),
            save: doc.querySelector('#save'),
            overlay: doc.querySelector('.modal-overlay'),
            title: doc.querySelector('.title'),
            path: doc.querySelector('#path'),
        }

        this.dom.path.value = localStorage.path ? localStorage.path : ''
	    
		this.registerListeners()
    }
	registerListeners(){

        this.dom.overlay.onclick = e => {
            if (e.target == this.dom.overlay) {
                this.close()
            }
        }
        
        this.dom.save.onclick = e => new Promise(res => {

            const val = this.dom.path.value
            const path = val.slice(val.length-1) == '/' ? val : `${val}/`

            this.dispatchEvent(
                new CustomEvent(
                    `save-settings`, 
                    { 
                        bubbles: true,
                        composed: true,
                        detail: { res, path }
                    }
                )
            )
        })
        .then(x => this.close())
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
                //while(this.dom.log.lastChild){
                //    this.dom.removeChild(this.dom.log.lastChild)
                //}
            }
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
customElements.define(ReapoSettings.is, ReapoSettings);