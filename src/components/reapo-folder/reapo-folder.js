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
  background: #011627;
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
.actions {
    bottom: 0;
    height: 3.3rem;
    width: 100%;
    display: grid;
    background: #4f23d7;
    border-radius: 0px 0px 5px 5px;
    vertical-align: middle;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 2fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    justify-items: center;
    align-items: center;
    align-items: center;
    box-shadow: 0 -3px 5px 0px rgba(0,0,0,0.12);
}
.action {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    border-radius: 5px;
    bottom: 0;
}
</style>

<div class="card">
    <h3 class="title"></h3>
    <div class="actions">
        <div id="show" class="action" title="View in App" tabindex="1">
            <svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,10L8,14H11V20H13V14H16M19,4H5C3.89,4 3,4.9 3,6V18A2,2 0 0,0 5,20H9V18H5V8H19V18H15V20H19A2,2 0 0,0 21,18V6A2,2 0 0,0 19,4Z" />
            </svg>
        </div>
        <div id="other" class="action" title="">
            
        </div>
        <div id="code" class="action" title="Open in VS Code" tabindex="1">
            <svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
            </svg>
        </div>
    </div>
</div>`

export class ReapoFolder extends HTMLElement {

    constructor(title, path) {
        super()

        this.name = title
        this.path = path
        //this.title = `Manage ${title}`
        
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.dom = {
            code: this.shadowRoot.querySelector('#code'),
            show: this.shadowRoot.querySelector('#show'),
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
        
        this.dom.code.addEventListener('keyup', e => 
            e.code != 'Tab' ? e.target.onclick(e) : null)
        this.dom.code.onclick = e => {
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
                            cwd: `${this.path}/${this.name}`
                        }
                    })
                )
            )
            .then(console.info)
        }

   
        this.dom.show.addEventListener('keyup', e => 
            e.code != 'Tab' ? e.target.onclick(e) : null)
        this.dom.show.onclick = e => {
            e.cancelBubble = true
            e.preventDefault()
            this.dispatchEvent(new CustomEvent(
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
    }
	
    attributeChangedCallback(n, ov, nv) {

        switch (n) {
            case 'attrName': {}
        }
    }
}
customElements.define(ReapoFolder.is, ReapoFolder)