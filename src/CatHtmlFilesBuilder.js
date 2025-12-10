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
import HtmlFilesBuilder from './HtmlFilesBuilder.js';
import theBlog from './Blog.js';
import Formater from './Formater.js';
import theConfig from './Config.js';

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
	 * Build the contains of the nav for cats pages or an empty string for others pages
	 * Overload of the base class buildNavCatHeader
	 * @returns {String} the contains of the nav for cats pages or an empty string for others pages
	 */

	buildNavCatHeader ( ) {

		let catChildrensTitle = '';
		if ( fs.existsSync ( theConfig.srcDir + '/menu/catChildrensTitle.html' ) ) {
			catChildrensTitle = fs.readFileSync ( theConfig.srcDir + '/menu/catChildrensTitle.html' );
		}

		if ( this.#category.parent ) {
			return '<h1>' + this.#category.parent + ', ' + this.#category.name + '</h1>';
		}
		let childrensName = '<h1>' + this.#category.name + '</h1>';
		if ( 0 !== this.#category.childrens.length ) {
			childrensName += catChildrensTitle + '<p>';
			this.#category.childrens.forEach (
				children => {
					childrensName +=
						'<span><a href="/cat/' + Formater.toUrlString ( children ) + '/1/' +
						'/" title="' + children + '" >' +
						children + '</a> </span>';
				}
			);
			childrensName += '</p>';
		}
		return childrensName;
	}

	/**
	 * Overload of the base class method build
	 */

	build ( ) {
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