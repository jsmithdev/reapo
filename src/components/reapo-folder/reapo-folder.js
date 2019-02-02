// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

.card {
  width: 10rem;
  height: 10rem;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 5px;
  background: #525252;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
.card:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

.title {
    color: #EEE;
    padding-top: 42%;
}
</style>
<div class="card">
    <h3 class="title"></h3>
</div>`

export class ReapoFolder extends HTMLElement {

    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.dom = {
            title: this.shadowRoot.querySelector('.title')
        }
    }
    static get is() {
        return 'reapo-folder'
    }

    static get observedAttributes() {
        return ['title']
    }

    connectedCallback() {
        this.dom.onclick = () => {
            new CustomEvent()
        }
    }
	
    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'title': {
                this.dom.title.textContent = nv
                break;
            }
        }
    }
}
customElements.define(ReapoFolder.is, ReapoFolder);
/* .card {
	padding: 1rem;
    border-radius: 5px;
    max-width: 100%;
    min-height: 20rem;
    background: #EEE;
} */