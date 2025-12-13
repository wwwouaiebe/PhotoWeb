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
 * Build the html page for the all hashtags
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AllHashTagsHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

    	/**
	 * Overload of the base class getter rootDestDir
	 * @type {String}
	 */

	get rootDestDir ( ) { return 'allhashtags/'; }

	/**
	 * Overload of the base class method buildArticlesHtml.
	 */

	buildArticlesHtml ( ) {
		let articlesHtml = '';
		theBlog.blogHashTags.forEach (
			hashTag => {
				articlesHtml += '<h1>' + hashTag.hashTag + '</h1><p>';
				hashTag.photoIsoDates.forEach (
					photoIsoDate => {
						const post = theBlog.blogPosts.find (
							element => 0 === element.photoIsoDate.localeCompare ( photoIsoDate )
						);
						const postInfos = post.categories.toString ( ) + ', ' +
                            Formater.isoDateToHumanDateTime ( post.photoIsoDate );
						articlesHtml +=
                            '<a href="/posts/' +
                            Formater.isoDateToUrlString ( photoIsoDate ) +
                            '/" title="' + postInfos +
                            '"><img src="/medias/photos/posts/' +
                            Formater.isoDateToUrlString ( photoIsoDate ) +
                            '_s.WebP" title=" ' +
                            postInfos + '"></a> ';
					}
				);
				articlesHtml += '</p>';
			}
		);
		articlesHtml += '</p>';

		return articlesHtml;
	}

	/**
	 * Overload of the base class method buildPagesHtml
	 */

	buildPagesHtml ( ) {

		fs.mkdirSync (
			theConfig.destDir + this.rootDestDir, { recursive : true }
		);

		fs.writeFileSync (
			theConfig.destDir + this.rootDestDir + '/' + 'index.html',
			this.buildHtmlString ( )
		);
	}

	/**
	 * Overload of the base class method build
	 */

	build ( ) {
		super.build ( );
		this.buildPagesHtml ( );
	}

	/**
     * The constructor
     */

	constructor ( ) {
		super ( );
	}

}

export default AllHashTagsHtmlFilesBuilder;


/* --- End of file --------------------------------------------------------------------------------------------------------- */