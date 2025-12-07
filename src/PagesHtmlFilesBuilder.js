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
import Formater from './Formater.js';
import fs from 'fs';
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Build the html page for the blog's 'page'
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class PagesHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

	/**
	 * The 'page' for witch the page is currently builded
	 * @type {Post}
	 */

	#page;

	/**
	 * Overload of the base class getter rootDestDir
	 * @type {String}
	 */

	get rootDestDir ( ) { return 'pages/'; }

	/**
	 * Overload of the base class method buildArticlesHtml.
	 * @returns {String} An html string with the article of the current page
	 */

	buildArticlesHtml ( ) {
		return '<h1>' + this.#page.pageName + '</h1>' + this.#page.pageContent;
	}

	/**
	 * Overload of the base class method buildPagesHtml
	 * @param {Page} page the 'page' for witch the page is build
	 */

	buildPagesHtml ( page ) {
		this.#page = page;

		fs.mkdirSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( this.#page.pageName ) + '/', { recursive : true }
		);

		fs.writeFileSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( page.pageName ) + '/' + 'index.html',
			this.buildHtmlString ( )
		);
	}

	/**
	 * Overload of the base class method build
	 */

	build ( ) {
		super.build ( );
		theBlog.blogPages.forEach (
			page => {
				this.buildPagesHtml ( page );
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

export default PagesHtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */