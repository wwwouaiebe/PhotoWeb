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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Derived class for building pages when no more than 1 page is needed. See derived classes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class SinglePageHtmlFilesBuilder extends HtmlFilesBuilder {

	/**
	 * Build an html string for the pagination <div>. Overload of the vase class method. We don't need pagination
	 * to the next or previous page nor page number nor slde show
	 * @returns {String} the html string for the pagination part
	 */

	buildPaginationHtml ( ) {
		let returnValue =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/main/1/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>' +
            '</div>';
		return returnValue;
	}

	/**
	 * Overload of the base class getter. We don't have posts for the 'page' pages, the all cat pages and all dates page
	 * @type {Array}
	 */

 	get blogPosts ( ) { return []; }

	/**
	 * The constructor
	 */

	constructor ( ) {
		super ( );
	}
}

export default SinglePageHtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */