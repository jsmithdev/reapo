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
    vertical-align: middle;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
}


.title {
    padding: 1rem;
}

.container {
    margin: 0 auto;
    display: inline-block;
    vertical-align: bottom;
    height: 200px;
    width: 100%;
    max-height: 100%;
    /*padding-top: 20%;*/
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
    outline: none;
    background: transparent;
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

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html {
  min-height: 100%;
  max-height: 100%;
}

body {
  margin: 64px auto;
  max-width: 640px;
  width: 94%;
    max-height: 100%;
  text-align: center;
}

.modal-body {
    background: #EEE;
    width: 85%;
    margin: auto;
    min-width: 420px;
}

/**
 * Circle Styles       background: linear-gradient(#eee, #ddd, #4f23d7);
 */

.circle {
    position: relative;
    display: -webkit-box;
    margin: 0 auto;
    color: #222;
    vertical-align: middle;
    max-height: 100%;
    max-width: 555px;
    text-align: center;
}

.circle:after {
    display: block;
    padding-bottom: 100%;
    width: 100%;
    height: 0;
    border-radius: 50%;
    
    background: #DDD;
    content: "";

    background-image: linear-gradient(bottom, #011627, #011627 25%, transparent 25%, transparent 100%);
    background-image: -webkit-linear-gradient(bottom, #011627, #011627 25%, transparent 25%, transparent 100%)  
}


.circle__inner {
  position: absolute;
    max-height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.circle__wrapper {
    max-height: 100%;
  display: table;
  width: 100%;
  height: 100%;
}

.circle__content {
    max-height: 100%;
  display: table-cell;
  padding: 1em;
  vertical-align: middle;
}

@media (min-width: 480px) {
  .circle__content {
    font-size: 1em;
  }
}

@media (min-width: 768px) {
  .circle__content {
    font-size: 2em;
  }
}

footer {
    
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 1fr 1fr;
}
svg {
    height: 4rem;
    max-width: 50%;
    cursor: pointer;
}

#name {
    opacity: 0;
    margin-top: 4rem;
}
#name.active {
    opacity: 1;
}
</style>

<body>
    <div class="is-hidden modal-overlay">
        <div class="modal-body">

            <h3 class="title">Menu</h3>
            <div class="container">
                
                <div class="inputs">
                    <label for="path">Path to a Repo</label>
                    <br/>
                    <input id="path" class="text" placeholder="Eg: /home/jamie/repo"/>
                    <br/>
                </div>

                <button id="save">Save</button>
            </div>

            <footer>
            
                <div></div>
            
                <div>
                    <input id="name" />
                    <svg id="new" viewBox="0 0 24 24">
                        <path fill="#FFF" d="M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z" />
                    </svg>
                </div>

                <div></div>

            </footer>

        </div>
    </div>
</body>`

//export class ReapoSettings extends HTMLElement {
class ReapoSettings extends HTMLElement {

    constructor() {
        super()
        this.codes = { action: ['Enter'], cancel: ['Esc'] }
        this.attachShadow({ mode: 'open' })
    }
    static get is() {
        return 'reapo-settings'
    }

    static get observedAttributes() {
        return []
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.registerElements(this.shadowRoot)
    }
    registerElements(doc) {

        this.dom = {

            body: doc.querySelector('body'),
            sync: doc.querySelector('#sync'),
            modal: doc.querySelector('.modal'),
            save: doc.querySelector('#save'),
            overlay: doc.querySelector('.modal-overlay'),
            title: doc.querySelector('.title'),
            path: doc.querySelector('#path'),
            new: doc.querySelector('#new'),
            name: doc.querySelector('#name'),
        }

        this.dom.path.value = localStorage.path ? localStorage.path : ''

        this.registerListeners()
    }
    registerListeners() {

        this.dom.overlay.onclick = e => {
            if (e.target == this.dom.overlay) {
                this.close()
            }
        }

        this.dom.save.onclick = e => new Promise(res => {

            const val = this.dom.path.value
            const path = val.slice(val.length - 1) == '/' ? val : `${val}/`

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

        this.dom.save.onclick = e => new Promise(res => {

            const val = this.dom.path.value
            const path = val.slice(val.length - 1) == '/' ? val : `${val}/`

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

        this.dom.new.onclick = e => new Promise(res => {
            
            if(this.dom.name.classList.contains('active')){
                
                const name = this.dom.name.value   
        		this.mkRepo(name, res)
            }
            this.dom.name.classList.add('active')
            this.dom.name.focus()            
        })

        this.dom.name.onkeyup = e => new Promise(res => {
            console.log(e.code)
            if(!this.codes.action.includes(e.code)){return}

            const name = this.dom.name.value
            name 
            ? this.mkRepo(name, res)
            : this.toast(`Type a name and hit enter to create a repo 😯`, res)
        })
        .then(x => {
            
            this.dispatchEvent(
                new CustomEvent(
                    `refresh-repo`,
                    {
                        bubbles: true,
                        composed: true,
                        detail: { }
                    }
                )
            )
            this.close()
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

    open(detail) {
        if (detail) {
            if (this.caller != detail.from) {
                //while(this.dom.log.lastChild){
                //    this.dom.removeChild(this.dom.log.lastChild)
                //}
            }
        }

        this.dom.overlay.classList.remove('is-hidden')
    }
    close() {
        this.dom.overlay.classList.add('is-hidden')
    }

    cleanStatus(str) {
        return str
            .replace(/</gi, `:`)
            .replace(/>/gi, `:`)
            .replace(/master'./, `baster'.<br/>`)
            .replace(/modified: /g, `modified: <br/>`)
    }


    mkRepo(name, res){
        this.dispatchEvent(
            new CustomEvent(
                `new-repo`,
                {
                    bubbles: true,
                    composed: true,
                    detail: { name, res }
                }
            )
        )
        res()
    }

    toast(msg, res){
        this.dispatchEvent(
            new CustomEvent(
                `toast`,
                {
                    bubbles: true,
                    composed: true,
                    detail: { msg, res }
                }
            )
        )
    }
}
customElements.define(ReapoSettings.is, ReapoSettings)

module.exports = ReapoSettings