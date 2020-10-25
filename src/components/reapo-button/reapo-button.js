/*
* Use tag to import via es6 module (html import deprecated in v1 spec :/ )
* <script type="module" src="../components/web-component/web-component.js"></script>
*/
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
    
    button {
        border: none;
        color: var(--color-lightest);
        padding: 1rem;
        border-radius: 5px;
        cursor: pointer;
        width: fit-content;
        background: var(--color-mid);
    }
    button:hover {
        opacity: .7;
    }
    
    .left {
        text-align: left;
    }
    .center {
        text-align: center;
    }
    .right {
        text-align: right;
    }
    
</style>

<button></button>
`

export class ReapoButton extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
	
    static get is() {
        return 'reapo-button'
    }

    static get observedAttributes() {
        return [
            'color', 
            'background', 
            'align', 
            'label', 
        ]
    }

    set background(value){
        setTimeout(
            () => this.dom.button.style.background = value,
            0
        )
    }
    set color(value){
        setTimeout(
            () => this.dom.button.style.color = value,
            0
        )
    }
    set align(value){
        setTimeout(
            () => this.dom.button.classList.add(value),
            0
        )
    }
    set label(value){
        setTimeout(
            () => this.dom.button.textContent = value,
            0
        )
    }
    /**
     * replace class from element
     * @param {Element} el element
     * @param {String} old to remove
     * @param {String} value to add
     */
    replaceClass(el, old, value){
        el.classList.remove(old)
        el.classList.add(value)
    }

    connectedCallback() {

        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
	
    registerElements(doc){
        
        this.dom = {
            button: doc.querySelector('button'),
        }
	    
		this.initElements()
    }
    initElements(doc){
        
		this.registerListeners()
    }
	
	registerListeners(){
    
	}
	
    attributeChangedCallback(prop, oldValue, value) {
        this[prop] = value
    }

    error(message){
        this.toast(message)
    }

	toast(msg, res){
		this.dispatchEvent(
			new CustomEvent(
				'toast',
				{
					bubbles: true,
					composed: true,
					detail: { msg, res }
				}
			)
		)
    }
}

customElements.define(ReapoButton.is, ReapoButton)
