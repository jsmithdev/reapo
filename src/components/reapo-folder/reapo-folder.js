// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'
// /home/jamie/repo/reapo/src/stylesheets/icons.svg
const icon = `${__dirname}/../src/stylesheets/icons.svg#code`

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

.icon_small {
    fill: #ec00ff;
    margin: 2px;
    vertical-align: middle;
}
.action {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    background: #EEE;
    border-radius: 50%;
    bottom: 0;
}
</style>

<div class="card">
    <div class="action">
        <svg id="code" class="icon_small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
        </svg>
    </div>
    <h3 class="title"></h3>
</div>`

export class ReapoFolder extends HTMLElement {

    constructor(title, path) {
        super()

        this.name = title
        this.path = path
        this.title = `Manage ${title}?`
        
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.dom = {
            code: this.shadowRoot.querySelector('#code'),
            title: this.shadowRoot.querySelector('.title')
        }

        this.dom.title.textContent = title
    }
    static get is() {
        return 'reapo-folder'
    }

    static get observedAttributes() {
        return ['title']
    }

    connectedCallback() {
        
        this.dom.code.onclick = e => {
            e.cancelBubble = true
            this.exec(`code ${this.path}`)
        }

        this.onclick = () => this.dispatchEvent(new CustomEvent(
            `open-modal`, 
            { 
                bubbles: true, 
                composed: true,
                detail: {
                    from: this.is,
                    name: this.name, 
                    path: this.path
                }
            })
        )
    }
	
    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'attrName': {}
        }
    }
}
customElements.define(ReapoFolder.is, ReapoFolder)