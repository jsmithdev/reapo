// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const ipcRenderer = require('electron').ipcRenderer

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

svg {
        height: fit-content;
        /* max-width: 50%; */
        cursor: pointer;
    }
    path {
        fill: #eee;
    }

    .help {
        font-size: 0.7rem;
        background: #ffd70e;
        color: #011627;
        border: 1pt solid #3a208e;
        width: 1em;
        height: 1em;
        padding-left: .25rem;
        padding-right: .25rem;
        vertical-align: super;
        cursor: help;
        border-radius: 10px;
        padding: .1rem .25rem;
    }
    
    .title {
        background: #011627;
        color: white;
        text-align: center;
        border-radius: 5px 5px 0 0;
        margin: 0;    
        height: 3rem;
        padding-top: 1rem;
    }

    .action {
        height: auto;
        text-align: center;
        background: #4f23d7;
        border-radius: 0 0 5px 5px;
        cursor: pointer;
    }
    .action input {
        color: white;
        -webkit-appearance: none;
        background-color: #3a208e;
        -webkit-rtl-ordering: logical;
        cursor: text;
        padding: 4px 0 5px 0;
        width: 100%;
        padding-left: 7px;
        border-width: 0px;
        outline-color: #ffd70e;

        line-height: 3;
    }
    .action input::placeholder {
        color: #eee;
    }

</style>

<div>

    <h2 class="title">Directory <span class="help" title="Used to set the main directory of your projects that will show in the main view">?</span></h2>
    
    <div class="action" title="Set your main directory 🦄">
        
        <input id="path" class="text" placeholder="Eg: /home/jamie/repo"/>
        
        <svg viewBox="0 0 24 24">
            <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
        </svg>
    </div>
</div>
`

class ReapoDir extends HTMLElement {

    constructor() {
        super()
        this.codes = { action: ['Enter'], cancel: ['Esc'] }
        this.attachShadow({ mode: 'open' })
    }

    static get is() {
        return 'reapo-dir'
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

            action: doc.querySelector('.action'),
            path: doc.querySelector('#path'),
        }

        this.dom.path.value = localStorage.path ? localStorage.path : ''
                
        this.registerListeners()
    }

    registerListeners() {
        
        /* Save Main Directory */
        this.dom.action.onclick = e => new Promise(res => {

            const val = this.dom.path.value

            if(!val || val == localStorage.path || val+'/' == localStorage.path){ return }

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
        .then(() => this.clear())

        /* If Enter is pressed in input, trigger click */
        this.dom.path.onkeyup = e => this.codes.action.includes(e.code) ? this.dom.path.click() : null
    }

    attributeChangedCallback(n, ov, nv){ }

    /* Clear inputs & Close */
    clear(){

        this.dispatchEvent(
            new CustomEvent(`close-reapo-settings`, { 
                bubbles: true,
                composed: true
            })
        )
        this.dom.path.value = ''
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
    
    clear(msg, res){
        this.dom.path.value = ''
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

customElements.define(ReapoDir.is, ReapoDir)
module.exports = ReapoDir