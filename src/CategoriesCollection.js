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

import Category from './Category.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A collection for categories...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class CategoriesCollection {

	/**
	 * A map to store the categories. The key of the map is the category name
	 * @type {Map}
	 */

	#categories = new Map ( );

	/**
	 * get a category from it's name
	 * @param {String} categoryName the category name
	 * @returns {Category} the corresponding category
	 */

	getCategory ( categoryName ) {
		return this.#categories.get ( categoryName );
	}

	/**
	 * A map to store the categories. The key of the map is the category name
	 * @type {Map}
	 */

	getCategories ( ) {
		return this.#categories;
	}

	/**
	 * get all the categories that are parent ( = having the parent property set to null), sorted by name
	 * @returns {Array.<Category>} the parent categories
	 */

	getParentCategories ( ) {
		const parentCategories = [];
		this.#categories.forEach (
			category => {
				if ( ! category.parent ) {
					parentCategories.push ( category );
				}
			}
		);
		parentCategories.sort (
			( first, second ) => {
				if ( first.name > second.name ) {
					return 1;
				}
				if ( first.name < second.name ) {
					return -1;
				}
				if ( first.name === second.name ) {
					return 0;
				}
			}
		);
		return parentCategories;
	}

	/**
	 * Add a new category to the categories collection
	 * @param {String} parentName the parent name of the category
	 * @param {String} childrenName the children name of the category
	 */

	#setCategory ( parentName, childrenName ) {

		// Searching a parent category
		let parentCategory = this.#categories.get ( parentName );
		if ( ! parentCategory ) {

			// no parent category found... We create a parent category and we add it to the collection
			parentCategory = new Category ( parentName );
			this.#categories.set ( parentCategory.name, parentCategory );
		}

		if ( childrenName ) {

			// it's a children category... Searching if we have already this category in the collection
			let childrenCategory = this.#categories.get ( childrenName );
			if ( ! childrenCategory ) {

				// no children category found... We create a children category and we add it to the collection
				childrenCategory = new Category ( parentName, childrenName );
				this.#categories.set ( childrenCategory.name, childrenCategory );
			}

			// We verify that the category is already added as children category of the parent
			if ( -1 === parentCategory.childrens.indexOf ( childrenCategory.name ) ) {
			    parentCategory.childrens.push ( childrenCategory.name );
			}
		}
 	}

	/**
	 * The constructor
	 * @param {Array.<Post>} blogPosts An array with all the posts of the blog
	 */

	constructor ( blogPosts ) {

		// Adding the categories from the posts
		blogPosts.forEach (
			post => { this.#setCategory ( post.categories[ 0 ], post.categories [ 1 ] ); }
		);

		// Sorting the childrens categories
		this.#categories.forEach (
			category => {
				category.childrens.sort (
					( first, second ) => {
						if ( first.toLowerCase ( ) > second.toLowerCase ( ) ) {
							return 1;
						}
						else if ( first.toLowerCase ( ) < second.toLowerCase ( ) ) {
							return -1;
						}
						else if ( first.toLowerCase ( ) === second.toLowerCase ( ) ) {
							return 0;
						}
					}
				);
			}
		);

		Object.freeze ( this );
	}
}

export default CategoriesCollection;

/* --- End of file --------------------------------------------------------------------------------------------------------- */