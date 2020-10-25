/*
* Use tag to import via es6 module (html import deprecated in v1 spec :/ )
* <script type="module" src="../components/web-component/web-component.js"></script>
*/
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
    
    section {
        z-index: 99;
        opacity: 1;
        transform: scale(0);

        display: block;
        position: fixed;
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        overflow-y: hidden;

        vertical-align: middle;
            
        white-space: normal;
        vertical-align: middle;
        word-break: break-all;
    }
    header {
        text-align: center;
        padding: .75rem 1rem 0;
        margin: 0 0 .75rem;
    }
    article {
        margin: .75rem;
        min-height: 4rem;
        min-width: 20rem;
    }
    footer {
        padding: .5rem;
        margin-top: .75rem;
        text-align: right;
        font-size: .8125rem;
        border-top: 1px solid #dddbda;
    }

    .active {
        z-index: 100;
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.1s, transform 0.1s;
    }

    div.close > span.x {
        cursor: pointer;
    }

    .footer__center {
        align-items: center;
        align-content: center;
        text-align: center;
    }

    .hidden {
        transform: scale(0);
        opacity: 0;
        z-index: -1;
    }

    .card {

        position: relative;
        padding: 1;
        background: #fff;
        border: 1px solid #dddbda;
        border-radius: .25rem;
        background-clip: padding-box;
        -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);

        min-height: 10em;
        display: table-cell;
        vertical-align: middle;
    }
    .modal-inner {
        
        overflow: hidden;
        max-width: 90%;
        max-height: 90%;
        overflow-x: hidden;
        overflow-y: auto;
        margin: 0;
        transform: translate(0, -50%)
        transition: opacity 0.2s, transform 0.2s, z-index 0s 0.2s;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
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

<div class="trigger">
    <slot name="trigger"></span>
</div>


<section
    class="hidden close"
    role="dialog"
    tabindex="-1"
    aria-labelledby="modal-heading-01"
    aria-modal="true"
    aria-describedby="modal-content-id-1">

    <div class="modal-inner">

        <div>
            <div class="close right" >
                <span title="Close" class="close">
                    <svg class="close" title="Close" style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path class="close" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </span>
            </div>
            <div class="card">

                <header>
                    <slot name="header">
                        <h2 class="header"></h2>
                    </slot>
                </header>

                <article>
                    <slot name="content">
                        Nothing in modal's content slot. See <a href="https://github.com/jsmithdev/modal">readme</a> for more
                    </slot>
                </article>

                <footer>

                    <div class="footer__center">
                        <slot name="footer-center"></slot>
                    </div>
                    
                    <slot name="footer"></slot>

                </footer>
            </div>
        </div>

    </div>
</section>
<div class="slds-backdrop slds-backdrop_open"></div>
`

export class Modal extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
	
    static get is() {
        return 'modal-component'
    }

    static get observedAttributes() {
        return [
            'header', 
            'trigger', 
            'variant',
            'close',
            'body-align',
            'body-color',
            'body-background',
            'body-border',
            'footer-separator',
            'close-icon-color',
        ]
    }

    set active(boolean){
        boolean
            ? this.replaceClass(this.dom.section, 'hidden', 'active')
            : this.replaceClass(this.dom.section, 'active', 'hidden')
    }

    set ['body-align'](value){
        setTimeout(
            () => this.dom.body.classList.add(value),
            0
        )
    }
    set ['body-color'](value){
        setTimeout(
            () => this.dom.card.style.color = value,
            0
        )
    }
    set ['body-background'](value){
        setTimeout(
            () => this.dom.card.style.background = value,
            0
        )
    }
    set ['body-border'](value){
        setTimeout(
            () => this.dom.card.style.border = `1pt solid ${value}`,
            0
        )
    }
    set ['footer-separator'](value){
        setTimeout(
            () => this.dom.footer.style.borderTop = `1pt solid ${value}`,
            0
        )
    }
    set ['close-icon-color'](value){
        setTimeout(
            () => this.shadowRoot.querySelector('svg.close')
                .style.fill = value === 'dark'
                    ? rgb(1, 22, 39)
                    : value === 'light'
                        ? '#EEE'
                        : value,
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
            section: doc.querySelector('section'),
            header: doc.querySelector('.header'),
            body: doc.querySelector('article'),
            closers: doc.querySelectorAll('.close'),
            trigger: doc.querySelector('.trigger'),
            footer: doc.querySelector('footer'),
            card: doc.querySelector('.card'),
        }
	    
		this.initElements()
    }
    initElements(doc){
        
        if(this.dom.header && this.header){
            this.dom.header.textContent = this.header
        }
        
        if(this.dom.trigger && this.trigger){
            const def = this.dom.trigger.querySelector('a')
            if(def){def.textContent = this.trigger}
        }
	    
		this.registerListeners()
    }
	
	registerListeners(){
    
        this.dom.trigger.onclick = _ => this.open()
    
        this.dom.closers.forEach(el => el.onclick = event => {
            event.target.classList.contains('close')
                ? this.close()
                : null
        })
	}
	
    attributeChangedCallback(prop, oldValue, value) {
        this[prop] = value
    }

    open(){
        this.active = true
    }
    
    close(){
        this.active = false
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

customElements.define(Modal.is, Modal)
