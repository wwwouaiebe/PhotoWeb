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

/**
 * javascript:(function(){var d=document,s=d.createElement('script');s.crossOrigin='anonymous';s.src='http://newanthisnes:6080/scripts/hash/Hashtags.js';d.body.appendChild(s);}())
 */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Dialog for HashTags edition
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class HashTagsDialog {

	/**
	 * The HTMLDialogElement associated to the dialog
	 * @type {HTMLDialogElement}
	 */

	#hashTagsDialogHtml;

	/**
	 * The file name ( = the img src) curently treated, without path or extension
	 * @type {string}
	 */

	#fileName;

	/**
	 * the hashtags collection
	 * @type {Array.<Object>}
	 */

	#hashTags;

	/**
	 * the checkboxes in the dialog
	 * @type {Array.<HTMLInputElement>}
	 */

	#checkBoxesHtml = [];

	/**
	 * The edit box for new hashTag
	 * @type HTMLInputElement
	 */

	#editBoxNewHashTagHtml;

	/**
	 * Add the checkboxes to the dialog
	 */

	#addCheckBoxes ( ) {
		let hashTagsCounter = 0;
		this.#checkBoxesHtml.length = 0;
		let paragraphHtml = null;

		// Loop on hashTags
		this.#hashTags.forEach (
			hashTag => {
				hashTagsCounter ++;
				const checkBoxId = 'checkbox' + String ( hashTagsCounter ).padStart ( 2, '0' );
				paragraphHtml = document.createElement ( 'p' );
				let labelHtml = document.createElement ( 'label' );
				labelHtml.innerText = hashTag.hashTag;
				labelHtml.htmlFor = checkBoxId;
				let checkBoxHtml = document.createElement ( 'input' );
				checkBoxHtml.type = 'checkbox';
				checkBoxHtml.checked = hashTag.fileNames.includes ( this.#fileName );
				checkBoxHtml.id = checkBoxId;
				paragraphHtml.appendChild ( checkBoxHtml );
				paragraphHtml.appendChild ( labelHtml );
				this.#hashTagsDialogHtml.appendChild ( paragraphHtml );
				this.#checkBoxesHtml.push ( checkBoxHtml );
			}
		);

		// Adding the edit box
		paragraphHtml = document.createElement ( 'p' );
		this.#editBoxNewHashTagHtml = document.createElement ( 'input' );
		this.#editBoxNewHashTagHtml.type = 'text';
		paragraphHtml.appendChild ( this.#editBoxNewHashTagHtml );
		this.#hashTagsDialogHtml.appendChild ( paragraphHtml );
	}

	/**
	 * Add the currently treated img 
	 * @param {String} src the src for the img
	 */

	#addImage ( src ) {
		let img = document.createElement ( 'img' );
		img.src = src;
		let paragraphHtml = document.createElement ( 'p' );
		paragraphHtml.appendChild ( img );
		this.#hashTagsDialogHtml.appendChild ( paragraphHtml );
	}

	/**
	 * Event handler used when opening a file
	 * @param {event} changeEvent 
	 */

	#onChangeOpenFile ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				this.#hashTags = JSON.parse ( fileReader.result );
			}
			catch ( err ) {
				console.error ( err );
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ 0 ] );
	}

	/**
	 * Load the hashTags from a file
	 */

	loadHashTagsFromFile ( ) {
		const openFileInput = document.createElement ( 'input' );
		openFileInput.type = 'file';
		openFileInput.accept = 'json';

		openFileInput.addEventListener (
			'change',
			event => { this.#onChangeOpenFile ( event ); },
			false
		);
		openFileInput.click ( );
	}

	/**
	 * Verify that the user have selected a valid img
	 * @param {HTMLImageElement} target the img on witch the user have made a right click 
	 * @returns {Boolean} true when the image is valid
	 */

	#controlImage ( target ) {
		// Removing path and extension and eventually the '_s' in the file name
		let fileName = target.src
			.split ( '/' )
			.reverse ( ) [ 0 ]
			.split ( '.' )[ 0 ]
			.replaceAll ( /_s/g, '' );
		// Match...
		fileName = fileName.match (
			/[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}T[0-2]{1}[0-9]{1}[0-6]{1}[0-9]{1}[0-6]{1}[0-9]{1}/
		) [ 0 ];
		this.#fileName = fileName;

		// test if the file name is avalid date
		// eslint-disable-next-line no-magic-numbers
		fileName = fileName.slice ( 0, 13 ) + ':' + fileName.slice ( 13, 15 ) + ':' + fileName.slice ( 15 );
		return 'Invalid Date' !== new Date ( fileName ).toString ( );
	}

	/**
	 * Save the content of the dialog in the #hashTags variable
	 */

	#saveContent ( ) {

		// Saving checkboxes
		for ( let checkBoxCounter = 0; checkBoxCounter < this.#checkBoxesHtml.length; checkBoxCounter ++ ) {
			
			// Saving checked boxes
			if (
				this.#checkBoxesHtml [ checkBoxCounter ].checked
				&&
				! this.#hashTags [ checkBoxCounter ].fileNames.includes ( this.#fileName )
			) {
				this.#hashTags [ checkBoxCounter ].fileNames.push ( this.#fileName );
			}

			// Saving unchecked boxes
			if (
				! this.#checkBoxesHtml [ checkBoxCounter ].checked
				&&
				this.#hashTags [ checkBoxCounter ].fileNames.includes ( this.#fileName )
			) {
				this.#hashTags [ checkBoxCounter ].fileNames =
					this.#hashTags [ checkBoxCounter ].fileNames.filter (
						fileName => fileName !== this.#fileName
					);
			}
		}

		// Saving edit box
		if ( this.#editBoxNewHashTagHtml.value ) {
			this.#hashTags.push (
				{ hashTag : this.#editBoxNewHashTagHtml.value, fileNames : [ this.#fileName ] }
			);
			this.#hashTags.sort (
				( first, second ) => {
					if ( first.hashTag > second.hashTag ) {
						return 1;
					}
					else if ( first.hashTag < second.hashTag ) {
						return -1;
					}
					return 0;
				}
			);
		}
	}

	/**
	 * Close the dialog
	 */

	#close ( ) {
		this.#saveContent ( );
		this.#hashTagsDialogHtml.close ( );
	}

	/**
	 * Save the #hashTags variable in a file
	 */

	#saveToFile ( ) {
		this.#saveContent ( );
		this.#hashTags = this.#hashTags
			.filter ( hash => 0 < hash.fileNames.length )
			.sort (
				( first, second ) => {
					if ( first.hashTag > second.hashTag ) {
						return 1;
					}
					else if ( first.hashTag < second.hashTag ) {
						return -1;
					}
					return 0;
				}
			);
		const fileContent = JSON.stringify ( this.#hashTags );
		try {
			const objURL = window.URL.createObjectURL (
				new File ( [ fileContent ], 'hashtags.json', { type : 'application/json' } )
			);
			const element = document.createElement ( 'a' );
			element.setAttribute ( 'href', objURL );
			element.setAttribute ( 'download', 'hashtags.json' );
			element.click ( );
			window.URL.revokeObjectURL ( objURL );
		}
		catch ( err ) {
			if ( err instanceof Error ) {
				console.error ( err );
			}
		}
		this.#hashTagsDialogHtml.close ( );
	}

	/**
	 * Add buttons to the dialog
	 */
	#addButtons ( ) {

		// ok button
		const okButton = document.createElement ( 'button' );
		okButton.innerText = 'Ok';
		okButton.addEventListener (
			'click',
			() => { this.#close ( ); }
		);
		this.#hashTagsDialogHtml.appendChild ( okButton );

		// save to file button
		const saveButton = document.createElement ( 'button' );
		saveButton.innerText = 'Save';
		saveButton.addEventListener (
			'click',
			() => { this.#saveToFile ( ); }
		);
		this.#hashTagsDialogHtml.appendChild ( saveButton );
	}

	/**
	 * Open and build the dialog
	 * @param {HTMLImageElement} target the img on witch the user have made a right click
	 */

	open ( target ) {
		if ( ! this.#controlImage ( target ) ) {
			console.error ( 'invalid img' );
			return;
		};
		this.#hashTagsDialogHtml = document.createElement ( 'dialog' );
		document.body.appendChild ( this.#hashTagsDialogHtml );
		this.#addImage ( target.src );
		this.#addCheckBoxes ( );
		this.#addButtons ( );
		this.#hashTagsDialogHtml.showModal ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

/**
 * The one and only one HashTagsDialog 
 * @type {HashTagsDialog}
 */

const theHashTagsDialog = new HashTagsDialog ( );

/**
 * context menu event handler
 */

class ImgContextMenuEL {

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Event handler
	 * @param {*} event 
	 */

	handleEvent ( event ) {
		event.preventDefault ( );
		theHashTagsDialog.open ( event.target );
	}
}

// loading data from file
theHashTagsDialog.loadHashTagsFromFile ( );

// Adding event listeners
const imgCollection = document.getElementsByTagName ( 'img' );
for ( let counter = 0; counter < imgCollection.length; counter ++ ) {
	imgCollection [ counter ].addEventListener ( 'contextmenu', new ImgContextMenuEL ( ), false );
}

/* --- End of file --------------------------------------------------------------------------------------------------------- */