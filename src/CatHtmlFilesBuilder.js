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

import HtmlFilesBuilder from './HtmlFilesBuilder.js';
import theBlog from './Blog.js';
import Formater from './Formater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * CBuild the html page for categories
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class CatHtmlFilesBuilder extends HtmlFilesBuilder {

	/**
	 * The currently processed category
	 * @type {Category}
	 */

	#category;

	/**
	 * Overload of the base class getter rootDestDir
	 * @type {String}
	 */

	get rootDestDir ( ) { return 'cat/' + Formater.toUrlString ( this.#category.name ) + '/'; }

	/**
	 * Overload of the base class method build
	 */

	build ( ) {
		this.buildNavHtml ( );
		theBlog.blogCategories.getCategories ( ).forEach (
			category => {
				this.#category = category;
				this.buildPagesHtml ( theBlog.getCategoryPosts ( this.#category.name ) );
			}
		);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		super ( );
	}

}

export default CatHtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */