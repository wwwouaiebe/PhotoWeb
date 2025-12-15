/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
Doc reviewed ...
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * oops page manager
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Oops {

	/**
	 * The dimensions of the squares
	 * @type {Number}
	 */

	static #squareDim = 72;

	/**
	 * The max-width of the page
	 * @type {Number}
	 */

	static #maxWidth = 972;

	/**
	 * The red square html element
	 * @type {HtmlElement}
	 */

	#redSquare;

	/**
	 * The x position of the pointer when dragging the red square
	 * @type {Number}
	 */

	#clientX = 0;

	/**
	 * The left position of the red square
	 * @type {Number}
	 */

	#redSquareLeft = 0;

	/**
	 * The left position of the green square
	 * @type {Number}
	 */

	#greenSquareLeft = 0;

	/**
	 * A flag indicating that a dragging operation is started
	 * @type {Boolean}
	 */

	#moveActive = false;

	/**
	 * A counter for the move 
	 * @type {Number}
	 */

	#moveCounter = 0;

	/**
	 * The margins dimension 
	 * @type {Number}
	 */

	#margin = 0;

	/**
	 * The width available for the page
	 * @type {Number}
	 */

	#widthAvailable = 0;

	/**
	 * Reset the variables
	 */

	#reset ( ) {
		this.#clientX = 0;
		this.#moveActive = false;
		this.#moveCounter = 0;
		this.#redSquareLeft = Math.ceil ( this.#margin + ( 0.25 * this.#widthAvailable ) - ( 0.5 * Oops.#squareDim ) );
		this.#redSquare.style.left = String ( this.#redSquareLeft ) + 'px';
	}

	/**
	get the width and height available
	@type {Object} a read only object with width and height properties
	*/

	get screenAvailable ( ) {

		const testHTMLElement = document.createElement ( 'div' );
		testHTMLElement.style.position = 'absolute';
		testHTMLElement.style.bottom = 0;
		testHTMLElement.style.right = 0;
		testHTMLElement.style.height = 1;
		testHTMLElement.style.width = 1;
		document.body.appendChild ( testHTMLElement );
		const boundingClientRect = testHTMLElement.getBoundingClientRect ( );
		const screenAvailableHeight = boundingClientRect.bottom;
		const screenAvailableWidth = boundingClientRect.right;
		document.body.removeChild ( testHTMLElement );

		return Object.freeze (
			{
				height : screenAvailableHeight,
				width : screenAvailableWidth
			}
		);
	}

	/**
	 * The procedure to continue on the web side
	 */

	#continue ( ) {
		let anchor = document.createElement ( 'a' );
		// eslint-disable-next-line no-magic-numbers
		anchor.href = String.fromCharCode ( 47, 109, 97, 105, 110, 47, 49, 47 );
		anchor.click ( );
	}

	/**
	 * No squares tests on dev
	 */

	async wait ( ) {
		const docURL = new URL ( window.location );
		if ( 'newanthisnes' === docURL.hostname || 'newouaie' === docURL.hostname ) {
			this.#continue ( );
		}
	}

	/**
	 * pointer up event handler
	 * @param {event} pointerUpEvent the event to handle
	 */

	#endMoveRedSquare ( pointerUpEvent ) {
		this.#moveActive = false;
		let deltaMove = pointerUpEvent.clientX - this.#clientX;
		this.#redSquareLeft += deltaMove;
		this.#redSquare.style.left = String ( this.#redSquareLeft ) + 'px';
		this.#redSquare.releasePointerCapture ( pointerUpEvent.pointerId );

		if (
			10 > Math.abs ( this.#redSquareLeft - this.#greenSquareLeft )
			&&
			10 < this.#moveCounter 
		) {
			this.#reset ( );
			this.#continue ( );
		}
		else {
			this.#reset ( );
		}
	}

	/**
	 * pointer move event handler
	 * @param {event} pointetMoveEvent the event to handle
	 */

	#moveRedSquare ( pointetMoveEvent ) {
		if ( ! this.#moveActive ) {
			return;
		}
		this.#moveCounter ++;
		let deltaMove = pointetMoveEvent.clientX - this.#clientX;
		this.#redSquareLeft += deltaMove;
		this.#redSquare.style.left = String ( this.#redSquareLeft ) + 'px';
		this.#clientX = pointetMoveEvent.clientX;
	}

	/**
	 * pointer down event handler
	 * @param {event} pointerDownEvent the event to handle
	 */

	#startMoveRedSquare ( pointerDownEvent ) {
		this.#moveActive = true;
		this.#redSquare.setPointerCapture ( pointerDownEvent.pointerId );
		this.#clientX = pointerDownEvent.clientX;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		
		Object.freeze ( this );

		// init variables
		this.#redSquare = document.getElementById ( 'oopsRedSquare' );
		this.#margin = Oops.#maxWidth < this.screenAvailable.width ? ( this.screenAvailable.width - Oops.#maxWidth ) / 2 : 0;
		this.#widthAvailable = Math.min ( this.screenAvailable.width , Oops.#maxWidth );
		this.#reset ( );
		this.#greenSquareLeft = Math.ceil ( this.#margin + ( 0.75 * this.#widthAvailable ) - ( 0.5 * Oops.#squareDim ) );

		// Moving the green square
		document.getElementById ( 'oopsGreenSquare' ).style.left = String ( this.#greenSquareLeft ) + 'px';

		//event handlers
		this.#redSquare.addEventListener ( 'pointerdown', event => this.#startMoveRedSquare ( event ) );
		this.#redSquare.addEventListener ( 'pointermove', event => this.#moveRedSquare ( event ) );
		this.#redSquare.addEventListener ( 'pointerup', event => this.#endMoveRedSquare ( event ) );
	}
}

new Oops ( ).wait ( );