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

import fs from 'fs';
import theConfig from './Config.js';
import CategoriesCollection from './CategoriesCollection.js';
import PostsCreator from './PostsCreator.js';
import PagesCreator from './PagesCreator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Asimple container for a blog
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Blog {

	/**
	 * The value to set in the author meta tag of the blog
	 * @type {String}
	 */

	#blogAuthor;

	/**
	 * The value to set in the title tag of the blog
	 * @type {String}
	 */

	#blogTitle;

	/**
	 * The value to set in the description meta tag of the blog
	 * @type {String}
	 */

	#blogDescription;

	/**
	 * The heading of the blog
	 * @type {String}
	 */

	#blogHeading;

	/**
	 * The value to set in the keywords meta tag of the blog
	 * @type {String}
	 */

	#blogKeywords;

	/**
	 * The value to set in the robots meta tag of the blog
	 * @type {String}
	 */

	#blogRobots;

	/**
	 * The posts of the blog
	 * @type {Array.<Post>}
	 */

	#blogPosts;

	/**
	 * The pages of the blog
	 * @type {Array.<Page>}
	 */

	#blogPages;

	/**
	 * The hashtags of the blog
	 * @type {Array.<Object}
	 */

	#blogHashTags;

	/**
	 * The categories of the blog
	 * @type {Array.<Category>}
	 */

	#blogCategories;

	/**
	 * A guard that verify that the data are loaded only once
	 * @type {boolean}
	 */

	#areDataLoaded;

	/**
	 *  A boolean that is true when
	 * - a blog.json file is found and loaded
	 * - the posts are loaded
	 * - the pages are loaded
	 * @type {boolean}
	 */

	#isValid;

	/**
	 * The value to set in the author meta tag of the blog
	 * @type {String}
	 */

	get blogAuthor ( ) { return this.#blogAuthor; }

	/**
	 * The value to set in the title tag of the blog
	 * @type {String}
	 */

	get blogTitle ( ) { return this.#blogTitle; }

	/**
	 * The value to set in the description meta tag of the blog
	 * @type {String}
	 */

	get blogDescription ( ) { return this.#blogDescription; }

	/**
	 * The heading of the blog
	 * @type {String}
	 */

	get blogHeading ( ) { return this.#blogHeading; }

	/**
	 * The value to set in the keywords meta tag of the blog
	 * @type {String}
	 */

	get blogKeywords ( ) { return this.#blogKeywords; }

	/**
	 * The value to set in the robots meta tag of the blog
	 * @type {String}
	 */

	get blogRobots ( ) { return this.#blogRobots; }

	/**
	 * The posts of the blog
	 * @type {Array.<Post>}
	 */

	get blogPosts ( ) { return this.#blogPosts; }

	/**
	 * The pages of the blog
	 * @type {Array.<Page>}
	 */

	get blogPages ( ) { return this.#blogPages; }

	/**
	 * The hashtags of the blog
	 * @type {Array.<Object}
	 */

	get blogHashTags ( ) { return this.#blogHashTags; }

	/**
	 *  A boolean that is true when
	 * - call to the loadData was previously done
	 * - a blog.json file is found and loaded
	 * - the posts are loaded
	 * - the pages are loaded
	 * @type {boolean}
	 */

	get isValid ( ) { return this.#isValid && this.#areDataLoaded; }

	/**
	 * The categories of the blog
	 * @type {Array.<Category>}
	 */

	get blogCategories ( ) { return this.#blogCategories; }

	/**
	 * Get all the posts for a given category name
	 * @param {String} categoryName the name of the category for witch the post are searched
	 * @returns {Array.<Post>} the posts of the category
	 */

	getCategoryPosts ( categoryName ) {
		return this.#blogPosts.filter (
			post => post.categories.includes ( categoryName )
		);
	}

	/**
	 * Load the data for the blog: the blog.json files, the posts, the pages and the categories
	 */

	async loadData ( ) {
		if ( this.#areDataLoaded ) {
			return;
		}
		this.#blogPosts = await new PostsCreator ( ).extract ( );
		this.#blogPages = await new PagesCreator ( ).extract ( );

		if ( fs.existsSync ( theConfig.srcDir + 'hashtags/hashtags.json' ) ) {
			this.#blogHashTags = JSON.parse (
				fs.readFileSync ( theConfig.srcDir + 'hashtags/hashtags.json' )
			);
		}
		else {
			this.#blogHashTags = [];
		}

		try {
			const blogData = JSON.parse (
				fs.readFileSync ( theConfig.srcDir + 'blog.json', { encoding : 'utf8' } )
			);
			this.#blogAuthor = blogData.blogAuthor;
			this.#blogTitle = blogData.blogTitle;
			this.#blogDescription = blogData.blogDescription;
			this.#blogHeading = blogData.blogHeading;
			this.#blogKeywords = blogData.blogKeywords;
			this.#blogRobots = blogData.blogRobots;
			this.#blogPosts.sort (
				( first, second ) => {
					if ( first.photoIsoDate > second.photoIsoDate ) {
						return -1;
					}
					else if ( first.photoIsoDate < second.photoIsoDate ) {
						return 1;
					}
					return 0;
				}
			);

			this.#blogCategories = new CategoriesCollection ( this.#blogPosts );
			this.#isValid &&= this.#blogPosts && this.#blogPages;
		}
		catch ( err ) {
			console.error ( err );
			this.#isValid = false;
		}
		this.#areDataLoaded = true;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		this.#isValid = true;
		this.#areDataLoaded = false;

	}
}

/**
 * The one and only one instance of the Blog class
 * @type {Blog}
 */

const theBlog = new Blog ( );

export default theBlog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */