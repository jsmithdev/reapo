

/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/read-readme/read-readme.js"></script>
*/
'use strict()'

import { marked } from './markdown';

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.card {
    padding: 1rem;
    border-radius: 5px;
    width: 95%;
    min-height: 20rem;
    background: #EEE;
    max-height: 65%;
    overflow-y: auto;
    position: absolute;
}
/* allow text to wrap on smaller devices */
pre {
  white-space: pre-line;
}

/**
* Reset css using some of chrome's user agent vals: https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css 
*/
* {
    text-align: left;
}
h1 {
    display: block;
    font-size: 2em;
    -webkit-margin-before: 0.67__qem;
    -webkit-margin-after: 0.67em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}

hr {
    display: block;
    -webkit-margin-before: 0.5em;
    -webkit-margin-after: 0.5em;
    -webkit-margin-start: auto;
    -webkit-margin-end: auto;
    border-style: inset;
    border-width: 1px;
}

h2 {
    display: block;
    font-size: 1.5em;
    -webkit-margin-before: 0.83__qem;
    -webkit-margin-after: 0.83em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}
h3 {
    display: block;
    font-size: 1.17em;
    -webkit-margin-before: 1__qem;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}
h4 {
    display: block;
    -webkit-margin-before: 1.33__qem;
    -webkit-margin-after: 1.33em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}
h5 {
    display: block;
    font-size: .83em;
    -webkit-margin-before: 1.67__qem;
    -webkit-margin-after: 1.67em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}
h6 {
    display: block;
    font-size: .67em;
    -webkit-margin-before: 2.33__qem;
    -webkit-margin-after: 2.33em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-weight: bold;
}
div {
    display: block;
}
layer {
    display: block;
}
article, aside, footer, header, hgroup, main, nav, section {
    display: block;
}








/*
Monokai style - ported by Luigi Maselli - http://grigio.org
*/

.hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    background: #272822; color: #ddd;
  }
  
  .hljs-tag,
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-strong,
  .hljs-name {
    color: #f92672;
  }
  
  .hljs-code {
    color: #66d9ef;
  }
  
  .hljs-class .hljs-title {
    color: white;
  }
  
  .hljs-attribute,
  .hljs-symbol,
  .hljs-regexp,
  .hljs-link {
    color: #bf79db;
  }
  
  .hljs-string,
  .hljs-bullet,
  .hljs-subst,
  .hljs-title,
  .hljs-section,
  .hljs-emphasis,
  .hljs-type,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-addition,
  .hljs-variable,
  .hljs-template-tag,
  .hljs-template-variable {
    color: #a6e22e;
  }
  
  .hljs-comment,
  .hljs-quote,
  .hljs-deletion,
  .hljs-meta {
    color: #75715e;
  }
  
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-doctag,
  .hljs-title,
  .hljs-section,
  .hljs-type,
  .hljs-selector-id {
    font-weight: bold;
  }
</style>
<div class="card">
    <pre></pre>
</div>`

export class ReadReadme extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'read-readme'
    }
    static get observedAttributes() {
        return ["string"];
    }
    
    connectedCallback() {

        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
    
    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
            case 'url':
                this.getDown(newValue) 
                break;
            
            case 'string':
                console.log('read-readme has string!!!')
                this.setMarkdown(newValue)
                break;
        }
    }


    async getDown(url){
        
        const markdown = await (await fetch(url)).text()
        
        this.setMarkdown(markdown)
    }

    setMarkdown(markdown){

        this.shadowRoot.querySelector('pre').innerHTML = marked()(markdown);
    }

    clear(){
        this.shadowRoot.querySelector('pre').innerHTML = ''
    }
}

customElements.define(ReadReadme.is, ReadReadme)