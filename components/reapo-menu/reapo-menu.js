// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>

    :root {
        --color-icon: #4f23d7;
        --color-icon-secondary: #ec00ff;
        width: 100%;
        text-align: right;
        --shadow-drop: drop-shadow(12px 12px 7px rgba(0, 0, 0, 0.5));
        transform: rotate(-90deg);
        transition-duration: .5s;
    }
    :root:hover {
    }
    .container {
        width: 100%;
        text-align: right;
    }

    
    svg {
        fill: #ec00ff;
        margin: .4rem .45rem .15rem .45rem;
        transform: rotate(0deg);
        transition-duration: .5s;
    }
    svg:hover {
        filter: var(--shadow-drop);
        transform: rotate(90deg);
        transition-duration: .5s;
    }
</style>

<div id="menu" class="container">
    <svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path  d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
    </svg>
</div>`


//export class ReapoMenu extends HTMLElement {
class ReapoMenu extends HTMLElement {

    constructor() {
        super()

        this.codes = {
            action: ['Space', 'Enter', 'Return']
        }
        
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.dom = {
            menu: this.shadowRoot.getElementById('menu')
        }
    }
    static get is() {
        return 'reapo-menu'
    }

    static get observedAttributes() {
        return []
    }

    connectedCallback() {
        

        //this.dom.code.addEventListener('keyup', e => 
        //    codes_action.includes(e.code) ? e.target.onclick(e) : null)

        /* this.dom.code.onclick = e => {
            e.cancelBubble = true
            e.preventDefault()

            console.log(this.name)
            console.log(this.path)
            
            new Promise(res => 
                this.dispatchEvent(new CustomEvent(
                    `open-code`, 
                    { 
                        bubbles: true, 
                        composed: true,
                        detail: {
                            res,
                            from: this.is,
                            cmd: 'code .', 
                            cwd: this.path+this.name
                        }
                    })
                )
            )
            .then(console.info)
        } */   
    }
	
    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'attrName': {}
        }
    }
}
customElements.define(ReapoMenu.is, ReapoMenu)

module.exports = ReapoMenu