/* eslint-disable no-console */
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`

<style type="text/css">

/* Common stuff */
.picker-wrapper, 
.slide-wrapper {
    position: relative;
    float: left;
}
.picker-indicator,
.slide-indicator {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
}
.picker,
.slide {
    cursor: crosshair;
    float: left;
}

/* Default skin */

.cp-default {
    background-color: gray;
    padding: 12px;
    box-shadow: 0 0 40px #000;
    border-radius: 15px;
    float: left;
}
.cp-default .picker {
    width: 200px;
}
.cp-default .slide {
    width: 30px;
    
}
.cp-default .slide-wrapper {
    margin-left: 10px;
}
.cp-default .picker-indicator {
    width: 5px;
    height: 5px;
    border: 2px solid darkblue;
    -moz-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    opacity: .5;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50);
    filter: alpha(opacity=50);
    background-color: white;
}
.cp-default .slide-indicator {
    width: 100%;
    height: 10px;
    left: -4px;
    opacity: .6;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=60);
    filter: alpha(opacity=60);
    border: 4px solid lightblue;
    -moz-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background-color: white;
}

/* Small skin */

.cp-small {
    padding: 5px;
    background-color: white;
    float: left;
    border-radius: 5px;
}
.cp-small .picker {
    width: 100px;
    height: 100px;
}
.cp-small .slide {
    width: 15px;
    height: 100px;
}
.cp-small .slide-wrapper {
    margin-left: 5px;
}
.cp-small .picker-indicator {
    width: 1px;
    height: 1px;
    border: 1px solid black;
    background-color: white;
}
.cp-small .slide-indicator {
    width: 100%;
    height: 2px;
    left: 0px;
    background-color: black;
}

/* Fancy skin */

.cp-fancy {
    padding: 10px;
/*    background-color: #C5F7EA; */
    background: -webkit-linear-gradient(top, #aaa 0%, #222 100%);   
    float: left;
    border: 1px solid #999;
    box-shadow: inset 0 0 10px white;
}
.cp-fancy .picker {
    width: 200px;
    height: 200px;
}
.cp-fancy .slide {
    width: 30px;
    height: 200px;
}
.cp-fancy .slide-wrapper {
    margin-left: 10px;
}
.cp-fancy .picker-indicator {
    width: 24px;
    height: 24px;
    background-image: url(http://cdn1.iconfinder.com/data/icons/fugue/bonus/icons-24/target.png);
}
.cp-fancy .slide-indicator {
    width: 30px;
    height: 31px;
    left: 30px;
    background-image: url(http://cdn1.iconfinder.com/data/icons/bluecoral/Left.png);
}

/* Normal skin */

.cp-normal {
    background-color: white;
    border-left: 4px solid #d6d6d6;
}
.cp-normal .picker {
    width: 200px;
    height: auto;
}
.cp-normal .slide {
    width: 30px;
    height: auto;
}
.cp-normal .slide-wrapper {
    margin-left: 10px;
}
.cp-normal .picker-indicator {
    width: 5px;
    height: 5px;
    border: 1px solid gray;
    opacity: .5;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50);
    filter: alpha(opacity=50);
    background-color: white;
    pointer-events: none;
}
.cp-normal .slide-indicator {
    width: 100%;
    height: 10px;
    left: -4px;
    opacity: .6;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=60);
    filter: alpha(opacity=60);
    border: 4px solid gray;
    background-color: white;
    pointer-events: none;
}
    .view {
        width: 100%;
        height: 250px;
    }
    .wrapper {
        bottom: 0;
        float: right;
    }
    .card {
        
        padding: 1rem;
        background-color: white;
    }
</style>

<div class="card">
    <div class="view">
        <div class="wrapper"></div>
    </div>
</div>
`

class ColorPicker extends HTMLElement {

	constructor() {
		super()
		//console.log('hi from constructor')
		this.attachShadow({ mode: 'open' })
	}
	static get is() {
		return 'color-picker'
	}

	static get observedAttributes() {
		return ['color']
	}

	getColor() {
		return this.color
	}

	setColor(hex, user) {

		this.color = hex
		if (this.dom) { this.dom.view.style.backgroundColor = this.color }
		if (this.CP && !user) { this.CP.setHex(this.color) }

	}

	connectedCallback() {

		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.registerElements(this.shadowRoot)
	}
	registerElements(doc) {

		this.dom = {
			wrapper: doc.querySelector('.wrapper'),
			view: doc.querySelector('.view'),
			set: doc.querySelector('.set'),
		}

		this.init()
	}

	init() {

		this.dom.wrapper.classList.add(this.theme ? this.theme : 'cp-normal')

		const color = this.getAttribute('color')
		this.setColor(color ? color : '#2287b5')

		const ColorPicker = new Picker(window, this.shadowRoot)

		this.CP = ColorPicker(
			this.dom.wrapper,
			hex => { //, hsv, rgb, pickerCoordinate, sliderCoordinate
				const fromUser = true
				this.setColor(hex, fromUser)
			}
		)
	}


	attributeChangedCallback(n, ov, nv) {
		
		console.log('attr => ')

		if (ov != nv) {
			switch (n) {
			case 'color': {

				const fromUser = false
				this.setColor(nv, fromUser)
				break
			}
			case 'theme':
				this.theme = nv
				break
			}
		}
	}
}
customElements.define(ColorPicker.is, ColorPicker)
module.exports = ColorPicker






function Picker(window, document, undefined) {

	const hueOffset = 15

	// This HTML snippet is inserted into the innerHTML property of the passed color picker element
	// when the no-hassle call to ColorPicker() is used, i.e. ColorPicker(function(hex, hsv, rgb) { ... });

	const colorpickerHTMLSnippet = [

		'<div class="picker-wrapper">',
		'<div class="picker"></div>',
		'<div class="picker-indicator"></div>',
		'</div>',
		'<div class="slide-wrapper">',
		'<div class="slide"></div>',
		'<div class="slide-indicator"></div>',
		'</div>'

	].join('')

	/**
     * Return mouse position relative to the element el.
     */
	function mousePosition(evt) {
		// IE:
		if (window.event && window.event.contentOverflow !== undefined) {
			return { x: window.event.offsetX, y: window.event.offsetY }
		}
		// Webkit:
		if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
			return { x: evt.offsetX, y: evt.offsetY }
		}
		// Firefox:
		const wrapper = evt.target.parentNode.parentNode
		return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop }
	}

	/**
     * Create SVG element.
     */
	function $(el, attrs, children) {

		el = document.ownerDocument.createElementNS('http://www.w3.org/2000/svg', el)

		for (const key in attrs)
			el.setAttribute(key, attrs[key])
		if (Object.prototype.toString.call(children) != '[object Array]') children = [children]
		let i = 0, len = (children[0] && children.length) || 0
		for (; i < len; i++)
			el.appendChild(children[i])
		return el
	}

	/**
     * Create slide and picker markup 
     */

	const slide = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' },
		[
			$('defs', {},
				$('linearGradient', { id: 'gradient-hsv', x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
					[
						$('stop', { offset: '0%', 'stop-color': '#FF0000', 'stop-opacity': '1' }),
						$('stop', { offset: '13%', 'stop-color': '#FF00FF', 'stop-opacity': '1' }),
						$('stop', { offset: '25%', 'stop-color': '#8000FF', 'stop-opacity': '1' }),
						$('stop', { offset: '38%', 'stop-color': '#0040FF', 'stop-opacity': '1' }),
						$('stop', { offset: '50%', 'stop-color': '#00FFFF', 'stop-opacity': '1' }),
						$('stop', { offset: '63%', 'stop-color': '#00FF40', 'stop-opacity': '1' }),
						$('stop', { offset: '75%', 'stop-color': '#0BED00', 'stop-opacity': '1' }),
						$('stop', { offset: '88%', 'stop-color': '#FFFF00', 'stop-opacity': '1' }),
						$('stop', { offset: '100%', 'stop-color': '#FF0000', 'stop-opacity': '1' })
					]
				)
			),
			$('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv)' })
		]
	)

	const picker = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' },
		[
			$('defs', {},
				[
					$('linearGradient', { id: 'gradient-black', x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
						[
							$('stop', { offset: '0%', 'stop-color': '#000000', 'stop-opacity': '1' }),
							$('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })
						]
					),
					$('linearGradient', { id: 'gradient-white', x1: '0%', y1: '100%', x2: '100%', y2: '100%' },
						[
							$('stop', { offset: '0%', 'stop-color': '#FFFFFF', 'stop-opacity': '1' }),
							$('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })
						]
					)
				]
			),
			$('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-white)' }),
			$('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-black)' })
		]
	)

	/**
     * Convert HSV representation to RGB HEX string.
     * Credits to http://www.raphaeljs.com
     */
	function hsv2rgb(hsv) {
		
		let R, G, B, X, C
		let h = (hsv.h % 360) / 60

		C = hsv.v * hsv.s
		X = C * (1 - Math.abs(h % 2 - 1))
		R = G = B = hsv.v - C

		h = ~~h
		R += [C, X, 0, 0, X, C][h]
		G += [X, C, C, X, 0, 0][h]
		B += [0, 0, X, C, C, X][h]

		const r = Math.floor(R * 255)
		const g = Math.floor(G * 255)
		const b = Math.floor(B * 255)

		return { r: r, g: g, b: b, hex: '#' + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1) }
	}

	/**
     * Convert RGB representation to HSV.
     * r, g, b can be either in <0,1> range or <0,255> range.
     * Credits to http://www.raphaeljs.com
     */
	function rgb2hsv(rgb) {

		let r = rgb.r
		let g = rgb.g
		let b = rgb.b

		if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
			r /= 255
			g /= 255
			b /= 255
		}

		let H, S, V, C
		V = Math.max(r, g, b)
		C = V - Math.min(r, g, b)
		H = (C == 0 ? null :
			V == r ? (g - b) / C + (g < b ? 6 : 0) :
				V == g ? (b - r) / C + 2 :
					(r - g) / C + 4)
		H = (H % 6) * 60
		S = C == 0 ? 0 : C / V
		return { h: H, s: S, v: V }
	}

	/**
     * Return click event handler for the slider.
     * Sets picker background color and calls ctx.callback if provided.
     */
	function slideListener(ctx, slideElement, pickerElement) {
		return function (evt) {
			
			evt = evt || window.event
			
			const mouse = mousePosition(evt)
			ctx.h = mouse.y / slideElement.offsetHeight * 360 + hueOffset

			const pickerColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 })
			const c = hsv2rgb({ h: ctx.h, s: ctx.s, v: ctx.v })
			pickerElement.style.backgroundColor = pickerColor.hex
			ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b }, undefined, mouse)
		}
	}

	/**
     * Return click event handler for the picker.
     * Calls ctx.callback if provided.
     */
	function pickerListener(ctx, pickerElement) {

		return function (evt) {
		
			evt = evt || window.event

			const mouse = mousePosition(evt),
				width = pickerElement.offsetWidth,
				height = pickerElement.offsetHeight

			ctx.s = mouse.x / width
			ctx.v = (height - mouse.y) / height

			const c = hsv2rgb(ctx)
			ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b }, mouse)
		}
	}

	let uniqID = 0

	/**
     * ColorPicker.
     * @param {DOMElement} slideElement HSV slide element.
     * @param {DOMElement} pickerElement HSV picker element.
     * @param {Function} callback Called whenever the color is changed provided chosen color in RGB HEX format as the only argument.
     */
	function ColorPicker(slideElement, pickerElement, callback) {

		if (!(this instanceof ColorPicker)) return new ColorPicker(slideElement, pickerElement, callback)

		this.h = 0
		this.s = 1
		this.v = 1

		if (!callback) {
			// call of the form ColorPicker(element, funtion(hex, hsv, rgb) { ... }), i.e. the no-hassle call.

			const element = slideElement
			element.innerHTML = colorpickerHTMLSnippet

			this.slideElement = element.querySelector('.slide')
			this.pickerElement = element.querySelector('.picker')

			const slideIndicator = element.querySelector('.slide-indicator')
			const pickerIndicator = element.querySelector('.picker-indicator')

			ColorPicker.fixIndicators(slideIndicator, pickerIndicator)

			this.callback = function (hex, hsv, rgb, pickerCoordinate, slideCoordinate) {

				ColorPicker.positionIndicators(slideIndicator, pickerIndicator, slideCoordinate, pickerCoordinate)

				pickerElement(hex, hsv, rgb)
			}

		}
		else {

			this.callback = callback
			this.pickerElement = pickerElement
			this.slideElement = slideElement
		}


		// Generate uniq IDs for linearGradients so that we don't have the same IDs within one document.
		// Then reference those gradients in the associated rectangles.

		const slideClone = slide.cloneNode(true)
		const pickerClone = picker.cloneNode(true)

		const hsvGradient = slideClone.getElementsByTagName('linearGradient')[0]

		const hsvRect = slideClone.getElementsByTagName('rect')[0]

		hsvGradient.id = 'gradient-hsv-' + uniqID
		hsvRect.setAttribute('fill', 'url(#' + hsvGradient.id + ')')

		const blackAndWhiteGradients = [pickerClone.getElementsByTagName('linearGradient')[0], pickerClone.getElementsByTagName('linearGradient')[1]]
		const whiteAndBlackRects = pickerClone.getElementsByTagName('rect')

		blackAndWhiteGradients[0].id = 'gradient-black-' + uniqID
		blackAndWhiteGradients[1].id = 'gradient-white-' + uniqID

		whiteAndBlackRects[0].setAttribute('fill', 'url(#' + blackAndWhiteGradients[1].id + ')')
		whiteAndBlackRects[1].setAttribute('fill', 'url(#' + blackAndWhiteGradients[0].id + ')')

		this.slideElement.appendChild(slideClone)
		this.pickerElement.appendChild(pickerClone)

		uniqID++

		addEventListener(this.slideElement, 'click', slideListener(this, this.slideElement, this.pickerElement))
		addEventListener(this.pickerElement, 'click', pickerListener(this, this.pickerElement))

		enableDragging(this, this.slideElement, slideListener(this, this.slideElement, this.pickerElement))
		enableDragging(this, this.pickerElement, pickerListener(this, this.pickerElement))
	}

	function addEventListener(element, event, listener) {

		if (element.attachEvent) {

			element.attachEvent('on' + event, listener)

		} else if (element.addEventListener) {

			element.addEventListener(event, listener, false)
		}
	}

	/**
        * Enable drag&drop color selection.
        * @param {object} ctx ColorPicker instance.
        * @param {DOMElement} element HSV slide element or HSV picker element.
        * @param {Function} listener Function that will be called whenever mouse is dragged over the element with event object as argument.
        */
	function enableDragging(ctx, element, listener) {

		let mousedown = false

		addEventListener(element, 'mousedown', () => { mousedown = true })
		addEventListener(element, 'mouseup', () => { mousedown = false })
		addEventListener(element, 'mouseout', () => { mousedown = false })
		addEventListener(element, 'mousemove', e => {
			if (mousedown) {
				listener(e)
			}
		})
	}


	ColorPicker.hsv2rgb = function (hsv) {
		const rgbHex = hsv2rgb(hsv)
		delete rgbHex.hex
		return rgbHex
	}

	ColorPicker.hsv2hex = function (hsv) {
		return hsv2rgb(hsv).hex
	}

	ColorPicker.rgb2hsv = rgb2hsv

	ColorPicker.rgb2hex = function (rgb) {
		return hsv2rgb(rgb2hsv(rgb)).hex
	}

	ColorPicker.hex2hsv = function (hex) {
		return rgb2hsv(ColorPicker.hex2rgb(hex))
	}

	ColorPicker.hex2rgb = function (hex) {
		return { r: parseInt(hex.substr(1, 2), 16), g: parseInt(hex.substr(3, 2), 16), b: parseInt(hex.substr(5, 2), 16) }
	}

	/**
     * Sets color of the picker in hsv/rgb/hex format.
     * @param {object} ctx ColorPicker instance.
     * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
     * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
     * @param {string} hex String of the form: #RRGGBB.
     */
	function setColor(ctx, hsv, rgb, hex) {
		ctx.h = hsv.h % 360
		ctx.s = hsv.s
		ctx.v = hsv.v

		const c = hsv2rgb(ctx)

		const mouseSlide = {
			y: (ctx.h * ctx.slideElement.offsetHeight) / 360,
			x: 0    // not important
		}

		const pickerHeight = ctx.pickerElement.offsetHeight

		const mousePicker = {
			x: ctx.s * ctx.pickerElement.offsetWidth,
			y: pickerHeight - ctx.v * pickerHeight
		}

		ctx.pickerElement.style.backgroundColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 }).hex
		ctx.callback && ctx.callback(hex || c.hex, { h: ctx.h, s: ctx.s, v: ctx.v }, rgb || { r: c.r, g: c.g, b: c.b }, mousePicker, mouseSlide)

		return ctx
	}

	/**
     * Sets color of the picker in hsv format.
     * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
     */
	ColorPicker.prototype.setHsv = function (hsv) {
		return setColor(this, hsv)
	}

	/**
     * Sets color of the picker in rgb format.
     * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
     */
	ColorPicker.prototype.setRgb = function (rgb) {
		return setColor(this, rgb2hsv(rgb), rgb)
	}

	/**
     * Sets color of the picker in hex format.
     * @param {string} hex Hex color format #RRGGBB.
     */
	ColorPicker.prototype.setHex = function (hex) {
		return setColor(this, ColorPicker.hex2hsv(hex), undefined, hex)
	}

	/**
     * Helper to position indicators.
     * @param {HTMLElement} slideIndicator DOM element representing the indicator of the slide area.
     * @param {HTMLElement} pickerIndicator DOM element representing the indicator of the picker area.
     * @param {object} mouseSlide Coordinates of the mouse cursor in the slide area.
     * @param {object} mousePicker Coordinates of the mouse cursor in the picker area.
     */
	ColorPicker.positionIndicators = function (slideIndicator, pickerIndicator, mouseSlide, mousePicker) {

		if (mouseSlide) {
			slideIndicator.style.top = (mouseSlide.y - slideIndicator.offsetHeight / 2) + 'px'
		}
		if (mousePicker) {
			pickerIndicator.style.top = (mousePicker.y - pickerIndicator.offsetHeight / 2) + 'px'
			pickerIndicator.style.left = (mousePicker.x - pickerIndicator.offsetWidth / 2) + 'px'
		}
	}

	/**
     * Helper to fix indicators - this is recommended (and needed) for dragable color selection (see enabledDragging()).
     */
	ColorPicker.fixIndicators = function (slideIndicator, pickerIndicator) {

		pickerIndicator.style.pointerEvents = 'none'
		slideIndicator.style.pointerEvents = 'none'
	}

	return ColorPicker
}