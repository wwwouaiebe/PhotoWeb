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

import Page from './Page.js';
import theConfig from './Config.js';
import fs from 'fs';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Creates Page object from the blog src dir
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class PagesCreator {

	/**
	 * Exctract the 'page' informations from the blog src dir
	 * @returns {Array.<Page>} An array with Page objects
	 */

	async extract ( ) {
		const pages = [];
 		fs.readdirSync ( theConfig.pagesDir ).forEach (
			fileName => {
				const lstat = fs.lstatSync ( theConfig.pagesDir + fileName );
				if ( lstat.isFile ( ) && 'html' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
					pages.push (
						new Page (
					    fileName.slice ( 0, fileName.length - 5 ),
					    fs.readFileSync ( theConfig.pagesDir + fileName, { encoding : 'utf8' } )
				    )
					);
 				}
			}
		);
		return pages;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default PagesCreator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */