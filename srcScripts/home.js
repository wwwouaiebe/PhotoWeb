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

	constructor ( ) {
		Object.freeze ( this );
		const enterElement = document.createElement ( 'span' );
		enterElement.id = 'cyEnter';
		enterElement.innerText = 'Entrez';
		document.getElementsByTagName ( 'section' ) [ 0 ].appendChild ( enterElement );
		enterElement.addEventListener ( 'click', this.#continue );
	}
}

new Oops ( ).wait ( );