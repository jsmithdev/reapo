// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

require('../reapo-dir/reapo-dir.js')
require('../reapo-create/reapo-create.js')

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>

*,
*:before,
*:after {
  box-sizing: inherit;
}

html {
  min-height: 100%;
  max-height: 100%;
  box-sizing: border-box;
}


body {
    margin: 64px auto;
    max-width: 640px;
    width: 94%;
    max-height: 100%;
    text-align: center;

    /*margin: 40px auto;*/
    max-width: 650px;
    line-height: 1.6;
    font-size: 18px;
    color: #444;
    padding: 0 10px
}

:host ::-webkit-scrollbar {
	width: .25em;
}

:host ::-webkit-scrollbar-track {
	background: var(--color-lightest);
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

:host ::-webkit-scrollbar-thumb {
	background-color: var(--color-light);
	outline: 1px solid #525252;
}

/*
footer {
    
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 1fr 1fr;
}*/

svg {

    height: 4rem;
    max-width: 50%;
    cursor: pointer;
}
path {
    fill: var(--color-dark);
    /* fill-opacity: 0.5; */
    opacity: 0.5;
    /* stroke-opacity: 0.5; */
}

.is-hidden {
  display: none;
}

.modal-overlay {
    position: fixed;
    vertical-align: middle;
    top: 0px;
    left: 0;
    width: 100%;
    z-index: 99;
    height: 100%;
    max-height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
}

/*
background: linear-gradient(var(--color-lightest), #ddd, var(--color-mid));
*/

.circle {
    
    display: -webkit-box;
    margin: 0 auto;
    color: white;
    height: 95%;
    border-radius: 50%;
    vertical-align: middle;
    max-height: 95%;
    max-width: 85%;
    text-align: center;
}

.circle:after {
    display: block;
    padding-bottom: 100%;
    width: 100%;
    height: 0;
    border-radius: 50%;
    
    background: #DDD;
    content: "";

    background-image: linear-gradient(bottom, var(--color-dark), var(--color-dark) 25%, transparent 25%, transparent 100%);
    background-image: -webkit-linear-gradient(bottom, var(--color-dark), var(--color-dark) 25%, transparent 25%, transparent 100%)  
}


.circle__inner {
    position: absolute;
    max-height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.circle__wrapper {
    max-height: 100%;
    display: table;
    width: 100%;
    height: 100%;
}

.circle__content {
    height: 100%;
    display: grid;
    grid-row-gap: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 20px;
    vertical-align: middle;
    grid-template-rows: 2fr;
    grid-template-columns: 1fr 1fr;
}

.title {
    padding: 1rem;
    padding: 0;
    margin: 0 0 3px 0px;
}

.container {
    margin: 0 auto;
    display: inline-block;
    vertical-align: bottom;
    height: 200px;
    width: 100%;
    max-height: 100%;
    padding: 20px 10px 2px 10px;
}
.icon_small {
    margin: 2px;
    width: 2rem;
    cursor: pointer;
    height: auto;
    fill: #525252;
    vertical-align: middle;
}
.text {
    color: white;
    border: none;
    outline: none;
    background: transparent;
    border-bottom: 1pt solid pink;
}

.subtitle {
    background: var(--color-dark);
    color: white;
    text-align: center;
    border-radius: 5px 5px 0 0;
    margin: 0;
    height: 4rem;
    padding-top: 5px;
}

.close {
    color: var(--color-dark);
    font-size: 4rem;
    border: 3pt solid #3a208e;
    /* float: right; */
    /* margin: 5rem; */
    position: fixed;
    right: 40px;
    height: auto;
    width: 5rem;
    text-align: center;
    border-radius: 5rem;
    background: var(--color-lightest);
    cursor: pointer;
    z-index: 9000;
    user-select: none;
}
.container {
    height: 10rem;
    max-width: 26rem;
}


@media only screen and (max-width:900px){

	/* styles for smaller than 900px; */
    .modal-overlay {
        overflow-x: auto;
        grid-template-columns: 1fr;
        height: 100%;
    }
    .circle__content {
        margin-top: 4rem;
        grid-row-gap: 0px;
        grid-template-rows: 0px;
        grid-template-columns: 1fr;
        overflow-x: auto;
    }
}
</style>

<body>

    <div class="is-hidden modal-overlay">

    <h1 class="close">X</h1>

    <svg fill-opacity="0.5" class="circle" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
  
        <div class="circle__inner">
        <div class="circle__wrapper">
        <div class="circle__content">

            <div class="container">
                <reapo-dir></reapo-dir>
            </div>
        
            <div class="container">
                <reapo-create></reapo-create>
            </div>

        </div>      
        </div>
        </div>
        </div>
    </svg>
    </div>
</body>`

class ReapoSettings extends HTMLElement {

	constructor() {
		super()
		this.codes = { action: ['Enter'], cancel: ['Esc'] }
		this.attachShadow({ mode: 'open' })
	}

	static get is() {
		return 'reapo-settings'
	}

	static get observedAttributes() {
		return []
	}

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}

	//attributeChangedCallback(n, ov, nv){ }

	registerElements(doc) {

		this.dom = {

			modal: doc.querySelector('.modal'),
			close: doc.querySelector('.close'),
			overlay: doc.querySelector('.modal-overlay'),
			create: doc.querySelector('reapo-create'),
		}

		this.registerListeners()
	}

	registerListeners() {

		/* Close Settings */
		[this.dom.overlay, this.dom.close].map(el => el.onclick = e => {

			e.cancelBubble = true
            
			if (e.target === el) {
				this.close()
			}
		})

		this.dom.create.addEventListener('close-settings', () => this.close())
	}

	open() {
		this.dom.overlay.classList.remove('is-hidden')
		this.dom.create.focus()
	}

	close() {
		this.dom.overlay.classList.add('is-hidden')
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

customElements.define(ReapoSettings.is, ReapoSettings)
module.exports = ReapoSettings