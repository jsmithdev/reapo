// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

require('../reapo-create/reapo-create.js')

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
    padding: 20px 10px 2px 10px;
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
    color: white;
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

.body {
    background: #EEE;
    width: 85%;
    margin: auto;
    min-width: 420px;
    padding: 1rem;
    color: white;
    background: linear-gradient(-45deg, #00e6ff, #4f23d7);
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
path {
    fill: #eee;
}
.title {
    padding: 0;
    margin: 0 0 3px 0px;
}
.iconContainer {
    text-align: center;
    background: #4f23d7;
    border-radius: 0 0 5px 5px;
    cursor: pointer;
}
.iconContainer input {
    color: white;
    -webkit-appearance: none;
    background-color: #3a208e;
    -webkit-rtl-ordering: logical;
    cursor: text;
    padding: 4px 0 5px 0;
    width: calc(100% - 7px);
    padding-left: 7px;
    border-width: 0px;
}
.iconContainer input::placeholder {
    color: #eee;
}
.subtitle {
    background: #011627;
    color: white;
    text-align: center;
    border-radius: 5px 5px 0 0;
    margin: 0;
    height: 4rem;
    padding-top: 5px;
}

</style>

<body>

    <div class="is-hidden modal-overlay">

        <div class="body">

            <h3 class="title">Settings</h3>

            <div class="container">
                
                <div class="inputs">
                    <label for="path">Path to Main Directory</label>
                    <br/>
                    <input id="path" class="text" placeholder="Eg: /home/jamie/repo"/>
                    <br/>
                </div>

                <button id="save">Save</button>
            </div>

            <footer>
            
                <div></div>
            
                <div>
                    <reapo-create></reapo-create>
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
        }

        this.dom.path.value = localStorage.path ? localStorage.path : ''

        this.registerListeners()
    }
    registerListeners() {

        /* Close Modal */
        this.dom.overlay.onclick = e => {
            if (e.target == this.dom.overlay) {
                this.close()
            }
        }

        /* Main Settings Save: Main Directory, ... */
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
    }

    attributeChangedCallback(n, ov, nv){}

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