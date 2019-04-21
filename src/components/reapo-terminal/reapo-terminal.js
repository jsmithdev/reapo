// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

.container {
    background: var(--color-dark);
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
	background: var(--color-dark);
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.container::-webkit-scrollbar-thumb {
	background-color: var(--color-light);
	outline: 1px solid #525252;
}

#log {
    height: 100%;
    padding: 0 1rem 0 1rem;
}


input {
    position: absolute;
    bottom: 0;
    width: 100%;
    color: white;
    font-size: 1.075rem;
    padding: 0.25rem;
    background: #444;
    outline: none;
    border: none;
    caret-color: var(--color-light);
}
input::selection {
    color: white;
    background: var(--color-light);
}
input[type=text]:focus, textarea:focus {
  box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  padding: 3px 0px 3px 3px;
  margin: 5px 1px 3px 0px;
  border: 1px solid rgba(81, 203, 238, 1);
}
input::before {
    content: '$';
    color: var(--color-light);
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
        return ['path', 'name', 'log', 'focus', 'clear']
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
            container: doc.querySelector('.container'),
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

            /* remember what is typed */
            this.codes.memory.includes(e.code) ? this.remember() : null
        }
    }

    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'log': this.logger(nv); break;
            case 'path': this.path = nv; break;
            case 'name': this.name = nv; break;
            case 'clear': this.clear(); break;
            case 'focus': setTimeout(() => this.dom.input.focus(), 0); break;
        }
    }

    exec(cmd){

        if(cmd === ''){ return }
        this.memory.banks.push(cmd)
        this.dom.input.value = ''
        
        if(cmd.toLowerCase() == 'clear'){ this.clear();  return; }
        
        //new Promise((res, rej) => 
        this.dispatchEvent(new CustomEvent(
            `exec-cmd`, 
            { 
                bubbles: true,
                composed: true,
                detail: {
                    cmd,
                    cwd: this.path+'/'+this.name,
                    responder: this.logger.bind(this)
                }
            })
        )
    }

    logger(s){

        if(s == 'exit'){ this.loggerExit(); return; }
        
        
        this.dom.log.textContent += `
${this.name}: ${new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
})
.format(new Date())}

${s}

`
        


        this.dom.container.scrollTop = this.dom.container.scrollHeight
    }
    
    loggerExit(){
        this.dom.log.textContent += `
--------------------${this.randEmo()}--------------------${this.randEmo()}--------------------${this.randEmo()}--------------------
`
        this.dom.container.scrollTop = this.dom.container.scrollHeight
    }


    
    remember(config){
        

        if(config){
            config.clear ? this.memory.count = 0 : null
        }
        this.memory.banks.push(cmd)
        
        this.dom.input.value = this.memory.banks[this.memory.count]


        console.log(this.memory.count)
        console.log(this.memory.banks)
        console.log(this.memory.banks[this.memory.count])

        this.memory.count++
    }

    randEmo(){
        const em = ['🦄','🚀','🎉','🧘','🔭','🎼','🍻','🏝','🐺','🐧']
        return em[Math.floor(Math.random() * em.length)]
    }

    clear(){
        this.dom.log.textContent = ''
        this.dom.input.value = ''
        console.log('cleared')
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