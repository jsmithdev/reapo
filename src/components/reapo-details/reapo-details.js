'use strict()'


const template = document.createElement('template')

template.innerHTML = /*html*/`

<link rel="stylesheet" href="./components/reapo-details/reapo-details.css">

<div class="is-hidden modal-overlay">
	<div class="card">

		<div class="info">
			<h3 class="title"></h3>
			<pre class="moddate"></pre>
		</div>
	
		<div class="container">

			<div id="code" title="Open in VS Code" tabindex="0">
				<svg class="icon_small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
				</svg>
			</div>
		
			<div id="gitlink" title="Open in Github">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path fil d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
				</svg>
			</div>
			
			<div id="list" title="List Contents">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z" />
				</svg>
			</div>
		
			<div id="dir" title="Open in File Manager">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
				</svg>
			</div>
		
			<div id="terminal_popout" title="Open in Terminal">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
				</svg>
			</div>
		
			<div id="clear" title="Clear Terminal">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path d="M12,2A9,9 0 0,0 3,11V22L6,19L9,22L12,19L15,22L18,19L21,22V11A9,9 0 0,0 12,2M9,8A2,2 0 0,1 11,10A2,2 0 0,1 9,12A2,2 0 0,1 7,10A2,2 0 0,1 9,8M15,8A2,2 0 0,1 17,10A2,2 0 0,1 15,12A2,2 0 0,1 13,10A2,2 0 0,1 15,8Z" />
				</svg>
			</div>
			
			<div id="openOrg" title="Open Salesforce org in browser \n(for sfdx projects)">
				<h1 class="icon_small">
					SF
				</h1>
			</div>
		
			<div id="sync" title="Git Status">
				<svg class="icon_small" viewBox="0 0 24 24">
					<path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
				</svg>
			</div>

			<div id="archive" title="Archive">
				<svg class="icon_small" viewBox="0 0 24 24"><!-- style="width:24px;height:24px" viewBox="0 0 24 24" -->
					<path d="M3,3H21V7H3V3M4,8H20V21H4V8M9.5,11A0.5,0.5 0 0,0 9,11.5V13H15V11.5A0.5,0.5 0 0,0 14.5,11H9.5Z" />
				</svg>
			</div>

			<div id="remove" title="Delete">
				<svg class="icon_small" viewBox="0 0 24 24"><!-- style="width:24px;height:24px" viewBox="0 0 24 24" -->
					<path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
				</svg>
			</div>
			<!-- general cloud icon
			<svg class="icon_small" viewBox="0 0 24 24">
				<path d="M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
			</svg>
			-->

		</div>

		<reapo-terminal></reapo-terminal>

	</div>
</div>
`;

export class ReapoModal extends HTMLElement {

	constructor() {
		super()
        
		this.attachShadow({mode: 'open'})
	}
	static get is() {
		return 'reapo-details'
	}

	static get observedAttributes() {
		return []
	}

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}

	/**
	 * @description Accumulate DOM Elements to be used
	 */
	registerElements(doc){
		//console.log('registerElements')
        
		this.dom = {

			term: doc.querySelector('reapo-terminal'),

			modal: doc.querySelector('.modal'),
			title: doc.querySelector('.title'),
			moddate: doc.querySelector('.moddate'),
			log: doc.querySelector('.terminal-log'),
			overlay: doc.querySelector('.modal-overlay'),

			code: doc.getElementById('code'),
			dir: doc.getElementById('dir'),
			sync: doc.getElementById('sync'),
			openOrg: doc.getElementById('openOrg'),
			list: doc.getElementById('list'),
			clear: doc.getElementById('clear'),
			remove: doc.getElementById('remove'),
			archive: doc.getElementById('archive'),
			gitlink: doc.getElementById('gitlink'),
			terminal_popout: doc.getElementById('terminal_popout'),
		}
	
		this.registerListeners()
	}

	/**
	 * @description Add Element Listeners
	 */
	registerListeners(){
		
		/* Open directory in OS file manager */
		this.dom.dir.onclick = () => {
			
			const last_char = this.dir.substring(this.dir.length-1, this.dir.length)

			const folder =  last_char === '/' || last_char === '\\' 
				? this.dir+this.name
				: this.dir+'/'+this.name
				
			this.dispatchEvent(
				new CustomEvent(
					'open-directory',
					{
						bubbles: true,
						composed: true,
						detail: { folder }
					}
				)
			)
		}
        
        
		/* Close */
		this.dom.overlay.onclick = e => {
			if (e.target == this.dom.overlay) {
				this.close()
			}
		}
		this.addEventListener(`close-${this.is}`, this.close)
        
		/* Delete Repo / trash can */
		this.dom.remove.onclick = () => {

			const name = this.name
            
			if(!confirm(`Would you like to trash ${name}?`)){ return }

			const last_char = this.dir.substring(this.dir.length-1, this.dir.length)

			const folder =  last_char === '/' || last_char === '\\' 
				? this.dir+this.name
				: navigator.appVersion.indexOf("Win") !== -1
					? this.dir+'\\'+this.name //windows command
					: this.dir+'/'+this.name //linux command

			this.dispatchEvent(
				new CustomEvent(
					'delete-repo',
					{
						bubbles: true,
						composed: true,
						detail: { name: folder }
					}
				)
			)
		}

		/* Run git status / sync icon */
		this.dom.sync.onclick = () => {
			this.dispatchEvent(new CustomEvent(
				'exec-cmd', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						cmd: 'git status',
						cwd: this.path+'/'+this.name,
						responder: x => this.dom.term.setAttribute('log', x),
						exit: () => this.dom.term.loggerExit(),
					}
				})
			)
		}

		/* Run open org / salesforce cloud icon */
		this.dom.openOrg.onclick = () => {
			
			const cmd = navigator.appVersion.indexOf("Win") !== -1
				? `more ".sfdx/sfdx-config.json"`//windows command
				: `cat .sfdx/sfdx-config.json`//linux command

			console.log(cmd)
			const cwd = this.path+'/'+this.name
			const responder = data => this.openOrg(data)

			const opts = { 
				bubbles: true, 
				composed: true,
				detail: {
					cmd,
					cwd,
					responder,
				}
			}

			this.dispatchEvent(new CustomEvent( 'exec-cmd', opts ))
		}

		/* Run Archiver / box icon */
		this.dom.archive.onclick = async () => {
			
			try {

				const message = await new Promise((resolve, reject) => {
					this.dispatchEvent(new CustomEvent(
						'archive', 
						{ 
							bubbles: true, 
							composed: true,
							detail: {
								resolve, 
								reject,
								name: this.name,
								cwd: this.path+'/'
							}
						})
					)
				})

				this.dom.term.setAttribute('log', message)
			}
			catch(error){
				this.dom.term.setAttribute('log', error)
			}
		}

		/* Clear terminal */
		this.dom.clear.onclick = () => this.dom.term.setAttribute('clear', true)

		/* Run ls / list icon */
		this.dom.list.onclick = () => {

			const cmd = navigator.appVersion.indexOf("Win") !== -1
				? `dir`//windows command
				: `ls`//linux command
			
			this.dispatchEvent(new CustomEvent(
				'exec-cmd',
				{
					bubbles: true,
					composed: true,
					detail: {
						cmd,
						cwd: this.path+'/'+this.name,
						responder: x => this.dom.term.setAttribute('log', x)
					}
				})
			)
		}

		/* gitlink - go to github link in package.xml if exists / github icon */
		this.dom.gitlink.onclick = () => {
			
			this.dispatchEvent(new CustomEvent(
				'gitlink',
				{
					bubbles: true,
					composed: true,
					detail: {
						cwd: this.path+'/'+this.name,
						responder: x => this.dom.term.setAttribute('log', x)
					}
				})
			)
		}


		/* Open in VS Code / <> icon */
		this.dom.code.onclick = () => {
			
			this.dispatchEvent(new CustomEvent(
				'open-code', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						from: this.is,
						title: this.name,
						cmd: `code ${this.path}/${this.name}`, 
						cwd: `${this.path}/${this.name}`
					}
				})
			)
		}
		

		/* Open in VS Code / <> icon */
		this.dom.terminal_popout.onclick = () => {

			const cmd = navigator.appVersion.indexOf("Win") !== -1
				? `start cmd.exe @cmd /k "cd ${this.path}/${this.name}"` //windows command
				: `gnome-terminal --working-directory=${this.path}/${this.name}` //linux command

				this.dispatchEvent(new CustomEvent(
				'exec-cmd', 
				{ 
					bubbles: true, 
					composed: true,
					detail: {
						cmd,
						from: this.is,
						title: this.name,
						cwd: `${this.path}/${this.name}`
					}
				})
			)
		}

		/* Listen if user wants to key the action */
		//this.setKeyupAction(this.dom.code)
	}
	
	openOrg( data ){
		console.log(data)
		if(data.substring(0, 1) !== '{'){ return }

		const { defaultusername } = JSON.parse( data )
		
		const cwd = this.path+'/'+this.name
		const cmd = 'sfdx force:org:open -u '+defaultusername
		const responder = msg => this.dom.term.setAttribute('log', msg)
		const exit = () => this.dom.term.loggerExit()
				
		const opts = { 
			bubbles: true, 
			composed: true,
			detail: {
				cwd,
				cmd,
				responder,
				exit,
			}
		}

		const event = new CustomEvent( 'exec-cmd', opts )

		this.dispatchEvent( event )
	}

	open(detail){

		if(detail){
			if(this.caller != detail.from){
				while(this.dom.log.lastChild){
					this.dom.removeChild(this.dom.log.lastChild)
				}
			}
			this.caller = detail.from
			this.dom.title.textContent = detail.name

			const title = document.createElement('span')
			title.textContent = 'Last Modified'

			const content = document.createElement('span')
			content.textContent = detail.moddate
			
			while(this.dom.moddate.lastChild){
				this.dom.moddate.removeChild(this.dom.moddate.lastChild)
			}
			this.dom.moddate.appendChild(title)
			this.dom.moddate.appendChild(document.createElement('br'))
			this.dom.moddate.appendChild(content)

			this.path = detail.path
			this.name = detail.name
            
			this.dom.term.path = this.path
			this.dom.term.name = this.name
			this.dom.term.setAttribute('focus', true)
		}
        
		this.dom.overlay.classList.remove('is-hidden')
	}

	close(){
		this.dom.overlay.classList.add('is-hidden')
	}
}

customElements.define(ReapoModal.is, ReapoModal)