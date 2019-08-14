// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`

<link rel="stylesheet" href="./components/reapo-terminal/reapo-terminal.css">

<div class="container">
    <pre id="log"></pre>
    <input />
</div>
`


export class ReapoTerminal extends HTMLElement {

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

		this.dom.log.onclick = () => {
			if(!this.dom.log.textContent){
				this.dom.input.focus()
			}
		}
	}

	attributeChangedCallback(attribute, old_value, value) {

		switch (attribute) {
		case 'log': this.logger(value); break
		case 'path': this.path = value; break
		case 'name': this.name = value; break
		case 'clear': this.clear(); break
		case 'focus': setTimeout(() => this.dom.input.focus(), 0); break
		}
	}

	exec(cmd){

		if(!cmd || cmd === ''){ return }
		this.memory.banks.push(cmd)
		this.dom.input.value = ''
        
		if(cmd.toLowerCase() == 'clear'){ this.clear();  return }
        
		//new Promise((res, rej) => 
		this.dispatchEvent(new CustomEvent(
			'exec-cmd', 
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

	/**
	 * @description 
	 * Log out to the log which is a (pre)formated Element
	 * 
	 * @param {String} s 
	 */
	logger(s){

		if(s == 'exit'){ this.loggerExit(); return }
        
        
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
		this.memory.banks.push(config.cmd)
        
		this.dom.input.value = this.memory.banks[this.memory.count]

		this.memory.count++
	}

	randEmo(){
		const em = ['🦄','🚀','🎉','🧘','🔭','🎼','🍻','🏝','🐺','🐧']
		return em[Math.floor(Math.random() * em.length)]
	}

	clear(){

		const text = 'Console was cleared'

		this.dom.log.textContent = text

		this.dom.input.value = ''

		// eslint-disable-next-line no-console
		console.log(text)
	}
}

customElements.define(ReapoTerminal.is, ReapoTerminal)


/* 
function clean(str){
    console.dir(str)
    return str
    .replace(/\n/gi, `<br/>`)
}
    */