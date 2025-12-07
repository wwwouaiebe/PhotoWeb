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

import Formater from './Formater.js';
import fs from 'fs';
import theConfig from './Config.js';
import theBlog from './Blog.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Base class used to build the html pages of the site. See derived classes MainHtmlFilesBuilder, SinglePageHtmlFilesBuilder,
 * PostsHtmlFilesBuilder, PagesHtmlFilesBuilder
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class HtmlFilesBuilder {

	/**
	 * the posts for witch the pages have to be build
	 * @type {Array.<Post>}
	 */

	#blogPosts;

	/**
	 * The posts to be displayed in the currently build pages
	 * @type {Array.<Post>}
	 */

   	#currentPosts = [];

	/**
	 * The page number of the currently buid page
	 * @type {Number}
	 */

	#currentPageNumber;

	/**
	 * The post date currently active
	 * @type {String}
	 */

	#currentFormatedDate;

	/**
	 * The total pages number to build
	 * @type {Number}
	 */

	#totalPagesNumber;

	/**
	 * The number of posts to be displayed on each page
	 * @type {Number}
	 */

	#postsPerPage = 5;

	/**
	 * The html string for the <nav> part
	 * @type {String}
	 */

	#navHtml;

	/**
	 * The content of the nav html tag
	 * @type {String}
	 */

	get navHtml ( ) { return this.#navHtml; }

	/**
	 * the posts that have to be displayed on the build pages
	 * @type {Array.<Post>}
	 */

	get blogPosts ( ) { return this.#blogPosts; }

	/**
	 * the root destination dir. Must be overloaded in the derived classes
	 * @type {String}
	 */

	get rootDestDir ( ) { return ''; }

	/**
	 * Build an html string for the pagination <div>
	 * @returns {String} the html string for the pagination part
	 */

	buildPaginationHtml ( ) {

		// Header of the pagination
		let paginationHtml =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/main/1/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>';

		// pagination to newer posts
		if ( 1 !== this.#currentPageNumber ) {
			paginationHtml +=
				'<div id="cyPaginationNewestArrow">⮜</div>' +
				'<div id="cyPaginationNewest"><a href="/' + this.rootDestDir + '/' +
				( this.#currentPageNumber - 1 ) +
				 '/" title="Photos plus récentes">Photos plus récentes</a></div>';
		}

		// pagination to older post
		if ( this.#totalPagesNumber !== this.#currentPageNumber ) {
			paginationHtml +=
					'<div id="cyPaginationOldestArrow">⮞</div>' +
					'<div id="cyPaginationOldest"><a href="/' + this.rootDestDir + '/' +
					( this.#currentPageNumber + 1 ) +
					'/" title="Photos plus anciennes">Photos plus anciennes</a></div>';
		}

		// page number
		paginationHtml +=
			'<div id="cyPaginationCounter"> Page ' + this.#currentPageNumber + ' de ' + this.#totalPagesNumber + '</div>';

		// slide show
		paginationHtml +=
			'<div id="cyPaginationSlideShow"><a title="Lancer le diaporama">Diaporama slideshow</a></div>';

		// closing the div
		paginationHtml += '</div>';

		return paginationHtml;
	}

	/**
	 * Build the html string for the <nav> part
	 * Because the navigation is the same on all the builded pages, we compute this only one and save it in a variable
	 */

	buildNavHtml ( ) {

		// reading the menu
		this.#navHtml = fs.readFileSync ( theConfig.srcDir + 'menu/menu.html', { encoding : 'utf8' } );

		// replacing the {{PhotoWeb:navTop}} tag
		this.#navHtml = this.#navHtml.replaceAll ( /{{PhotoWeb:navTop}}/g, this.#buildNavTopHtml ( ) );
	}

	/**
	 *
	 * @returns {String} An html string with a link to parent categories
	 */

	#buildNavTopHtml ( ) {
		let navTop = '';

		// loop on the blog categories
		theBlog.blogCategories.getParentCategories ( ).forEach (
			parentCategory => {
				navTop +=
					'<span><a href="/cat/' + Formater.toUrlString ( parentCategory.name ) +
					'/1/" title="' + parentCategory.name + '">' + parentCategory.name + '</a></span>';
			}
		);
		return navTop;
	}

	/**
	 * get an html string containing a link to the category page of a category
	 * @param {String} categoryName The name of the category for witch a link must be build
	 * @returns {String} an html string with a link
	 */

	#getCategoryLinksHtml ( categoryName ) {
		let categoryLinksHtml = '';
		let parentCategory = null;
		let childrenCategory = theBlog.blogCategories.getCategory ( categoryName );
		if ( childrenCategory.parent ) {
			parentCategory = theBlog.blogCategories.getCategory ( childrenCategory.parent );
			categoryLinksHtml =
			    '<a href="/cat/' + Formater.toUrlString ( parentCategory.name ) + '/1/' +
                '/" title="' + parentCategory.name + '" >' +
			    parentCategory.name + '</a> ';
		}
		categoryLinksHtml +=
			'<a href="/cat/' + Formater.toUrlString ( childrenCategory.name ) + '/1/' +
            '/" title="' + childrenCategory.name + '" >' +
			childrenCategory.name + '</a> ';

		return categoryLinksHtml;
	}

	/**
	 * Build an html string with an article html tag from a post
	 * @param {Post} post
	 * @returns {String} an <article html tag with the post data
	 */

	buildArticleHtml ( post ) {

		// formatting the post date. Sometimes we need the date without time
		// and sometime with time...
		let postFormatedDate = Formater.isoDateToHumanDate ( post.photoIsoDate );
		let formatedDateTime = Formater.isoDateToHumanDateTime ( post.photoIsoDate );

		let postInfos = post.categories.toString ( ) + ', ' + formatedDateTime;

		let articleHtml = '';

		// adding a title if the post date changes
		if ( postFormatedDate !== this.#currentFormatedDate ) {
			articleHtml = '<h1>' + postFormatedDate + '</h1>';
			this.#currentFormatedDate = postFormatedDate;
		}

		// building the article html string
		articleHtml +=
			 '<article><figure><img class="cy' + post.photoHtmlClassName +
            '" width="' + post.photoWidth + '" height="' + post.photoHeight +
            '" src="' + post.mediaPhotoFileName +
            '" title="' + postInfos +
            '" alt="' + postInfos +
            '"><figcaption><p>' +
			this.#getCategoryLinksHtml ( post.categories [ 1 ] || post.categories [ 0 ] ) +
			formatedDateTime + '</p>' +
            '<p class="cyPictureInfo"><span>📷</span><span>' + post.photoTechInfo + '</span></p>' +
            '</figcaption></figure></article>';

		return articleHtml;
	}

	/**
	 * Build an html string with all the articles of the current page
	 * @returns {String} An html string with all the articles of the current page
	 */

	buildArticlesHtml ( ) {

		this.#currentFormatedDate = '';
		let ArticlesHtml = '';

		this.#currentPosts.forEach (
			currentPost => { ArticlesHtml += this.buildArticleHtml ( currentPost ); }
		);

		return ArticlesHtml;
	}

	/**
	 * Build a json string with an array of objects for the slide show
	 * @returns {String} a json string with an array with data for the slide show
	 */

	buildSlideShowData ( ) {
		let slideShowDataArray = [];
		this.blogPosts.forEach (
			post => {
				slideShowDataArray.push (
					{
						scr : post.mediaPhotoFileName,
						date : Formater.isoDateToHumanDateTime ( post.photoIsoDate ),
						exif : post.photoTechInfo,
						cat : post.categories.toString ( ),
						class : 'cy' + post.photoHtmlClassName
					}
				);
			}
		);

		return JSON.stringify ( slideShowDataArray );
	}

 	/**
	 * Build an html string for the current page
	 * @returns {String} the html string of the current page
	 */

	buildHtmlString ( ) {
		let htmlString = fs.readFileSync ( './html/page.html', { encoding : 'utf8' } );
		htmlString = htmlString
			.replaceAll ( /{{PhotoWeb:blogAuthor}}/g, theBlog.blogAuthor )
			.replaceAll ( /{{PhotoWeb:blogTitle}}/g, theBlog.blogTitle )
			.replaceAll ( /{{PhotoWeb:blogDescription}}/g, theBlog.blogDescription )
			.replaceAll ( /{{PhotoWeb:blogHeading}}/g, theBlog.blogHeading )
			.replaceAll ( /{{PhotoWeb:blogKeywords}}/g, theBlog.blogKeywords )
			.replaceAll ( /{{PhotoWeb:blogRobots}}/g, theBlog.blogRobots )
			.replaceAll ( /{{PhotoWeb:SlideShowData}}/g, this.buildSlideShowData ( ) )
			.replaceAll ( /{{PhotoWeb:articles}}/g, this.buildArticlesHtml ( ) )
			.replaceAll ( /{{PhotoWeb:pagination}}/g, this.buildPaginationHtml ( ) )
			.replaceAll ( /{{PhotoWeb:nav}}/g, this.navHtml );

		return htmlString;
	}

	/**
	 * Build all the pages for a collection of posts.
	 * @param {Array.<Post>} blogPosts the posts for witch the pages have to be build
	 */

	buildPagesHtml ( blogPosts ) {

		this.#blogPosts = blogPosts;
 		this.#currentPageNumber = 0;
		this.#totalPagesNumber = Math.ceil ( blogPosts.length / this.#postsPerPage );
		while ( this.#currentPageNumber < this.#totalPagesNumber ) {
			this.#currentPosts = blogPosts.slice (
				this.#currentPageNumber * this.#postsPerPage,
				( this.#currentPageNumber + 1 ) * this.#postsPerPage
			);
			this.#currentPageNumber ++;

			fs.mkdirSync ( theConfig.destDir + this.rootDestDir + this.#currentPageNumber + '/', { recursive : true } );

			fs.writeFileSync (
				theConfig.destDir + this.rootDestDir + this.#currentPageNumber + '/' + 'index.html',
				this.buildHtmlString ( )
			);
		}
	}

	/**
	 * Build the pages. Must be overloaded in the derived classes
	 */

	build ( ) {
		this.buildNavHtml ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default HtmlFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */