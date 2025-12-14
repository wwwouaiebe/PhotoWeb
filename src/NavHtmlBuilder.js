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
import theBlog from './Blog.js';
import theConfig from './Config.js';
import Formater from './Formater.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A class for computing the nav html tag. Because the navigation is the same in all the pages, we build the nav html
 * only once with a singleton.
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class NavHtmlBuilder {

	/**
	 * The contains of the nav html tag
	 * @type {String}
	 */

	#navHtml;

	/**
	 * The contains of the nav html tag
	 * @type {String}
	 */

	get navHtml ( ) {
		if ( this.#navHtml ) {
			return this.#navHtml;
		}

		this.#buildNavHtml ( );
		return this.#navHtml;

	}

	/**
	 * Build the html links to the categories
	 * @returns {String} the html links to the categories
	 */

	#buildAllCatsHtmlMenu ( ) {
		let categoriesHtmlMenu = '';

		// loop on the blog categories
		theBlog.blogCategories.getParentCategories ( ).forEach (
			parentCategory => {
				categoriesHtmlMenu +=
					'<span><a href="/cat/' + Formater.toUrlString ( parentCategory.name ) +
					'/1/" title="' + parentCategory.name + '"> ' +
					parentCategory.name.replaceAll ( / /g, '&nbsp;' ) + '</a> </span>';
			}
		);
		return categoriesHtmlMenu;
	}

	/**
	 * Build the html links to the hashtags
	 * @returns {String} the html links to the hashtags
	 */

	#buildAllHashTagsHtmlMenu ( ) {

		if ( 0 === theBlog.blogHashTags.length ) {
			return '';
		}

		let hashTagsHtmlMenu = '<h1>#</h1><p>';
		theBlog.blogHashTags.forEach (
			blogHashTag => {
				hashTagsHtmlMenu +=
					'<span> <a href="' + '/hashtags/' + Formater.toUrlString ( blogHashTag.hashTag ) +
					'/1/" title="# ' + blogHashTag.hashTag + '" >#&nbsp;' +
					blogHashTag.hashTag.replaceAll ( / /g, '&nbsp;' ) + '</a> </span>';
			}
		);
		hashTagsHtmlMenu +=
			'<span> <a href="' + '/allhashtags/" title="# Tous" ># Tous</a> </span>';

		hashTagsHtmlMenu += '</p>';

		return hashTagsHtmlMenu;
	}

	/**
	 * Build the nav html tag
	 */

	#buildNavHtml ( ) {

		// reading the menu
		this.#navHtml = fs.readFileSync ( theConfig.srcDir + 'menu/menu.html', { encoding : 'utf8' } );

		// replacing the {{PhotoWeb:navAllCats}} tag
		this.#navHtml = this.#navHtml.replaceAll ( /{{PhotoWeb:navAllCats}}/g, this.#buildAllCatsHtmlMenu ( ) );
		this.#navHtml = this.#navHtml.replaceAll ( /{{PhotoWeb:navAllHashTags}}/g, this.#buildAllHashTagsHtmlMenu ( ) );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {

	}

}

/**
 * The one and only one objectNavHtmlBuilder
 * @type {NavHtmlBuilder}
 */

const theNavHtmlBuilder = new NavHtmlBuilder ( );

export default theNavHtmlBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */