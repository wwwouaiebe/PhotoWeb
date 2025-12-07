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

import SinglePageHtmlFilesBuilder from './SinglePageHtmlFilesBuilder.js';
import theBlog from './Blog.js';
import fs from 'fs';
import theConfig from './Config.js';
import Formater from './Formater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Build the html page for a single post
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class PostsHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

	/**
	 * The post for witch the page is currently builded
	 * @type {Post}
	 */

	#post;

	/**
	 * Overload of the base class getter rootDestDir
	 * @type {String}
	 */

	get rootDestDir ( ) { return 'posts/'; }

	/**
	 * Overload of the base class method buildArticlesHtml. Call only the base class buildArticleHtml
	 * because we have only one post on the page
	 * @returns {String} An html string with the article of the current page
	 */

	buildArticlesHtml ( ) {
		return this.buildArticleHtml ( this.#post );
	}

	/**
	 * Overload of the base class method buildPagesHtml
	 * @param {Post} post the post for witch the page is build
	 */

	buildPagesHtml ( post ) {
		this.#post = post;

		const destDir = theConfig.destDir + this.rootDestDir + Formater.isoDateToUrlString ( this.#post.photoIsoDate );
		fs.mkdirSync ( destDir, { recursive : true } );

		fs.writeFileSync (
			destDir + '/' + 'index.html',
			this.buildHtmlString ( ) );
	}

	/**
	 * Overload of the base class method build
	 */

	build ( ) {
		super.build ( );
		theBlog.blogPosts.forEach (
			post => {
				this.buildPagesHtml ( post );
			}
		);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		super ( );
		Object.freeze ( this );
	}

}

export default PostsHtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */