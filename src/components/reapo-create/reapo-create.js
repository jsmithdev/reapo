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
        color: var(--color-dark);
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
        background: var(--color-dark);
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
        background: var(--color-mid);
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
    }
    .action input::placeholder {
        color: #eee;
    }





    select {
        width: 100%;
        background: #3a208e;
        color: white;
        outline-color: var(--color-dark);
        cursor: pointer;
        border: none;
        height: 1.5rem;
    }
    select:focus {
        outline-color: var(--color-dark);
    }

</style>

<div>

    <h2 class="title">Create <span class="help" title="To make a blank new repo just type a name and hit Enter (or click addition icon) &#10;
    To make make a new repo from .git repo, put the full .git url instead of a name and hit Enter (or click addition icon) &#10;
    To create a Salesforce Project using SFDX, select option from drop down, type a new and hit Enter (or click addition icon) &#10;">?</span></h2>
    
    <select>
        <option>Normal</option>
        <option>Salesforce Project</option>
    </select>
    
    <div class="action" title="Give a name for a new repo or paste a .git uri 🦄">
        
        <input id="name" placeholder="Name of folder, project or .git URL" />

        <svg viewBox="0 0 24 24">
            <path d="M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z" />
        </svg>
    </div>
</div>
`

class Reapocreate extends HTMLElement {

    constructor() {
        super()
        this.codes = { action: ['Enter'], cancel: ['Esc'] }
        this.attachShadow({ mode: 'open' })
    }

    static get is() {
        return 'reapo-create'
    }

    static get observedAttributes() {
        return []
    }

    connectedCallback() {

        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements(this.shadowRoot)
    }

    attributeChangedCallback(n, ov, nv){}

    registerElements(doc) {

        this.dom = {

            select: doc.querySelector('select'),
            new: doc.querySelector('.action'),
            name: doc.querySelector('#name'),
        }

        this.registerListeners()
    }

    registerListeners() {

        /* On new click, create repo */
        this.dom.new.onclick = e => {
            // If no name, don't create
            if(e.target == this.dom.name){ return }

            const name = this.dom.name.value

            name ? this.createRepo(name, localStorage.path) : this.toast('Please enter a name or .git url') // jshint ignore: line
        }

        /* If Enter is pressed in input, trigger new click */
        this.dom.name.onkeyup = e => this.codes.action.includes(e.code) ? this.dom.new.click() : null
    }


    /* Clear inputs & Close */
    clear(){
    
        this.dom.name.value = ''
        this.dom.select.value = ''
        this.offsetParent.click()
    }

    
    /* Create a Repo */
    createRepo(input, path) {

        if(!path){
            
            this.toast('Please set a Main Directory')
        }

        const isSfdx = this.dom.select.value.toLowerCase().includes('salesforce')
                
        const isGit = input.toLowerCase().includes('.git') && input.toLowerCase().includes('http')

        const name = isGit ? input.substring(input.lastIndexOf('/')+1, input.lastIndexOf('.')) : input
        
        // make type
        const type = isSfdx ? `new-sfdx`
            : isGit ? `new-git`
            : `new-repo`

        // make cmd
        const cmd = isSfdx ? `sfdx force:project:create --projectname ${name}`
            : isGit ? `git clone ${git}`
            : 'code .'
        
        const cwd = localStorage.path

        const event = newEvent(type, cmd, cwd, name)

        console.dir(event)

        this.dispatchEvent(event)
    }

    newEvent(type, cmd, cwd, name){

        return new CustomEvent(
            type,
            {
                bubbles: true,
                composed: true,
                detail: { 
                    cmd,
                    cwd,
                    responder: console.log,
                    exit: cleanup
                }
            }
        )
    }

    cleanup(x){

        console.log('Action commited')
        console.dir(x)
        this.toast(x.length > 200 ? `${x.substring(0, 200)}...` : x)
        
        this.dispatchEvent(
            new CustomEvent(
                `refresh-repo`,
                {
                    bubbles: true,
                    composed: true,
                    detail: { clear: true }
                }
            )
        )
        

        new Promise(res => this.dispatchEvent(new CustomEvent(
            `open-code`,
            {
                bubbles: true, 
                composed: true,
                detail: {
                    res,
                    from: this.is,
                    title: name,
                    cmd: 'code .', 
                    cwd: `${path}/${name}`
                }
            })
        ))
        .then(x => {
            console.log(x)
            this.dispatchEvent(
                new CustomEvent(`close-reapo-details`, { 
                    bubbles: true,
                    composed: true
                })
            )
        })
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

customElements.define(Reapocreate.is, Reapocreate)
module.exports = Reapocreate