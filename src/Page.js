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
 * A simple container to store à blog page
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Page {

	/**
	 * The name of the page
	 * @type {String}
	 */

	#pageName;

	/**
	 * The page content
	 * @type {String}
	 */

	#pageContent;

	/**
	 * The name of the page
	 * @type {String}
	 */

	get pageName ( ) { return this.#pageName; }

	/**
	 * The page content
	 * @type {String}
	 */

	get pageContent ( ) { return this.#pageContent; }

	/**
	 * The constructor
	 * @param {String} pageName The page name
	 * @param {String } pageContent The page content
	 */

	constructor ( pageName, pageContent ) {
		Object.freeze ( this );
		this.#pageName = pageName;
		this.#pageContent = pageContent;
	}
}

export default Page;

/* --- End of file --------------------------------------------------------------------------------------------------------- */