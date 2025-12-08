class mouseDownEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.mouseDown = 1;
	}
}

class DragStartEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.dragStart = 1;
	}
}

class DragEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.drag ++;
	}
}

class DragEndEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults = {
			mouseDown : 0,
			dragStart : 0,
			drag : 0,
			dragEnter : 0,
			dragOver : 0,
			drop : 0
		};
	}
}

class DragEnterEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.dragEnter = 1;
	}
}

class DragOverEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( event ) {
		event.preventDefault ( );
		this.#oops.dragResults.dragOver ++;
	}
}

class DragLeaveEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.dragEnter = 0;
		this.#oops.dragResults.dragOver = 0;
	}
}

class DropEL {

	#oops = null;

	constructor ( oops ) {
		this.#oops = oops;
		Object.freeze ( this );
	}

	handleEvent ( ) {
		this.#oops.dragResults.drop = 1;
		if (
			1 === this.#oops.dragResults.mouseDown
			&&
			1 === this.#oops.dragResults.dragStart
			&&
			// eslint-disable-next-line no-magic-numbers
			10 < this.#oops.dragResults.drag
			&&
			1 === this.#oops.dragResults.dragEnter
			&&
			5 < this.#oops.dragResults.dragOver
			&&
			1 === this.#oops.dragResults.drop
		) {
			this.#oops.continue ( );
		}
	}
}

class Oops {

	dragResults = {
		mouseDown : 0,
		dragStart : 0,
		drag : 0,
		dragEnter : 0,
		dragOver : 0,
		drop : 0
	};

	continue ( ) {
		let anchor = document.createElement ( 'a' );
		// eslint-disable-next-line no-magic-numbers
		const href = String.fromCharCode ( 47, 109, 97, 105, 110, 47, 49, 47 );
		anchor.href = href;
		anchor.click ( );
	}

	async wait ( ) {
		const docURL = new URL ( window.location );
		if ( 'newanthisnes' === docURL.hostname || 'newouaie' === docURL.hostname ) {

			// this.continue ( );
		}
	}

	constructor ( ) {
		document.getElementById ( 'red' ).addEventListener ( 'mousedown', new mouseDownEL ( this ) );
		document.getElementById ( 'red' ).addEventListener ( 'dragstart', new DragStartEL ( this ) );
		document.getElementById ( 'red' ).addEventListener ( 'drag', new DragEL ( this ) );
		document.getElementById ( 'red' ).addEventListener ( 'dragend', new DragEndEL ( this ) );
		document.getElementById ( 'green' ).addEventListener ( 'dragenter', new DragEnterEL ( this ) );
		document.getElementById ( 'green' ).addEventListener ( 'dragover', new DragOverEL ( this ) );
		document.getElementById ( 'green' ).addEventListener ( 'dragleave', new DragLeaveEL ( this ) );
		document.getElementById ( 'green' ).addEventListener ( 'drop', new DropEL ( this ) );
	}
}

new Oops ( ).wait ( );