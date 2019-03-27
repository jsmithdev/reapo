// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

.container {
    background: #011627;
    color: white;
    width: 100%;
    height: 70%;
    overflow-y: scroll;
    border-radius: 5px 0px;
}
.container::-webkit-scrollbar {
	width: .25em;
}
.container::-webkit-scrollbar-track {
	background: #011627;
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.container::-webkit-scrollbar-thumb {
	background-color: #ec00ff;
	outline: 1px solid #525252;
}

#log {
    height: 100%;
    padding: 0 1rem 0 1rem;
}


input {
    position: absolute;
    bottom: 0;
    width: calc(100% - 9px);
    color: white;
    font-size: 1.075rem;
    padding: 0.25rem;
    background: #444;
    outline: none;
    border: none;
    caret-color: #ec00ff;
}
input::selection {
    color: white;
    background: #ec00ff;
}
input[type=text]:focus, textarea:focus {
  box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  padding: 3px 0px 3px 3px;
  margin: 5px 1px 3px 0px;
  border: 1px solid rgba(81, 203, 238, 1);
}
input::before {
    content: '$';
    color: #ec00ff;
    font-weight: 600;
}


</style>

<div class="container">
    <pre id="log"></pre>
    <input />
</div>
`

//export class ReapoTerminal extends HTMLElement {
class ReapoTerminal extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    static get is() {
        return 'reapo-terminal'
    }

    static get observedAttributes() {
        return ['path', 'name', 'log', 'focus']
    }

    connectedCallback() {

        this.memory = { count: 0, banks: [] }
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements(this.shadowRoot)
    }

    registerElements(doc){
        
        this.dom = {
            log: doc.querySelector('#log'),
            input: doc.querySelector('input'),
        }
	    
		this.registerListeners()
    }

	registerListeners(){

        this.codes = {
            exec: ['Enter'],
            memory: ['ArrowUp']
        }
        
        this.dom.input.onkeyup = e => { // console.log(e.code)
            e.cancelBubble = true
            
            /* Exec on Enter codes */
            this.codes.exec.includes(e.code) ? this.exec(this.dom.input.value) : null

            /* remeber remember what is typed...bember... */
            this.codes.memory.includes(e.code) ? this.remember() : null
        }
    }

    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'log': this.logger(nv)
            case 'path': this.path = nv
            case 'name': this.name = nv
            case 'focus': setTimeout(() => this.dom.input.focus(), 0)
        }
    }

    exec(cmd){ 
        if(cmd === ''){ return }

        this.memory.banks.push(cmd)
        new Promise((res, rej) => 
            this.dispatchEvent(new CustomEvent(
                `exec-modal`, 
                { 
                    bubbles: true, 
                    composed: true,
                    detail: {
                        cmd,
                        cwd: this.path+'/'+this.name,
                        chain: { res, rej },
                    }
                })
            )
        )
        .then(res => this.logger(res))
        .catch(e => this.logger(e))
    }

    logger(s){
        
        
        this.dom.log.textContent += `${this.name}: ${new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        .format(new Date())}
        
        ${s}
        
        
        `
        this.dom.log.scrollTo(0, this.dom.log.scrollHeight);
    }
    
    remember(config){
        

        if(config){
            config.clear ? this.memory.count = 0 : null
        }

        
        this.dom.input.value = this.memory.banks[this.memory.count]


        console.log(this.memory.count)
        console.log(this.memory.banks)
        console.log(this.memory.banks[this.memory.count])

        this.memory.count++

    }
}

customElements.define(ReapoTerminal.is, ReapoTerminal)

module.exports = ReapoTerminal


/* 
function clean(str){
    console.dir(str)
    return str
    .replace(/\n/gi, `<br/>`)
}
    */