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
 * A simple container for a category
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Category {

	/**
	 * The category name
	 * @type {String}
	 */

	#name;

	/**
	 * The category parent
	 * @type {String}
	 */

	#parent = null;

	/**
	 * The category childrens
	 * @type {Array.<String>}
	 */

	#childrens = [];

	/**
	 * The category name
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * The category parent
	 * @type {String}
	 */

	get parent ( ) { return this.#parent; }

	/**
	 * The category childrens
	 * @type {Array.<String>}
	 */

	get childrens ( ) { return this.#childrens; }

	/**
	 * The constructor
	 * @param {String} parentName the name of the parent category
	 * @param {String} childrenName the name of the children category
	 */

	constructor ( parentName, childrenName ) {

		// If children name is null, its a root category, otherwise it's a children category
		this.#name = ( childrenName ? childrenName : parentName );
		if ( childrenName ) {
			this.#parent = parentName;
		}
		Object.freeze ( this );
	}
}

export default Category;

/* --- End of file --------------------------------------------------------------------------------------------------------- */