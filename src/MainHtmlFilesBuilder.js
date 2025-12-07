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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Build the main html pages (the pages with all the posts)
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class MainHtmlFilesBuilder extends HtmlFilesBuilder {

	/**
	 * the root destination dir. Overload of the base class
	 * @type {String}
	 */

	get rootDestDir ( ) { return 'main/'; }

	/**
	 * Overload of the base class method build
	 */

	build ( ) {

		// calling the base class
		super.build ( );

		// build the pages with all the posts
		this.buildPagesHtml ( theBlog.blogPosts );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		super ( );
	}

}

export default MainHtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */