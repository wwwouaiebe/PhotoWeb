import Formater from './Formater.js';
import fs from 'fs';
import theConfig from './Config.js';
import theBlog from './Blog.js';

class HtmlFilesBuilder {

   	#currentPosts = [];

	#currentPageNumber;

	#currentFormatedDate;

	#totalPagesNumber;

	#postsPerPage = 5;

	#navHtml;

	#blogPosts;

	get blogPosts ( ) { return this.#blogPosts; }

	get navHtml ( ) { return this.#navHtml; }

	get rootDestDir ( ) { return ''; }

	buildPaginationHtml ( ) {
		let returnValue =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/main/1/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>';

		if ( 1 !== this.#currentPageNumber ) {
			returnValue +=
				'<div id="cyPaginationNewestArrow">⮜</div>' +
				'<div id="cyPaginationNewest"><a href="/' + this.rootDestDir + '/' +
				( this.#currentPageNumber - 1 ) +
				 '/" title="Photos plus récentes">Photos plus récentes</a></div>';
		}

		if ( this.#totalPagesNumber !== this.#currentPageNumber ) {
			returnValue +=
					'<div id="cyPaginationOldestArrow">⮞</div>' +
					'<div id="cyPaginationOldest"><a href="/' + this.rootDestDir + '/' +
					( this.#currentPageNumber + 1 ) +
					'/" title="Photos plus anciennes">Photos plus anciennes</a></div>';
		}

		returnValue +=
			'<div id="cyPaginationCounter"> Page ' + this.#currentPageNumber + ' de ' + this.#totalPagesNumber + '</div>';

		returnValue +=
			'<div id="cyPaginationSlideShow"><a title="Lancer le diaporama">Diaporama slideshow</a></div>';

		returnValue += '</div>';

		return returnValue;
	}

	buildNavHtml ( ) {
		this.#navHtml = fs.readFileSync ( theConfig.srcDir + 'menu/menu.html', { encoding : 'utf8' } );
		this.#navHtml = this.#navHtml.replaceAll ( /{{PhotoWeb:navTop}}/g, this.#buildNavTopHtml ( ) );
	}

	#buildNavTopHtml ( ) {
		let navTop = '';
		theBlog.blogCategories.getParentCategories ( ).forEach (
			parentCategory => {
				navTop +=
					'<span><a href="/cat/' + Formater.toUrlString ( parentCategory.name ) +
					'/1/" title="' + parentCategory.name + '">' + parentCategory.name + '</a></span>';
			}
		);
		return navTop;
	}

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

	buildArticleHtml ( post ) {
		let postFormatedDate = Formater.formatDate ( post.photoIsoDate );
		let formatedDateTime = Formater.formatDateTime ( post.photoIsoDate );
		let postInfos = post.categories.toString ( ) + ', ' + formatedDateTime;

		let articleHtml = '';
		if ( postFormatedDate !== this.#currentFormatedDate ) {
			articleHtml = '<h1>' + postFormatedDate + '</h1>';
			this.#currentFormatedDate = postFormatedDate;
		}

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

	buildArticlesHtml ( ) {

		this.#currentFormatedDate = '';
		let ArticlesHtml = '';

		this.#currentPosts.forEach (
			currentPost => { ArticlesHtml += this.buildArticleHtml ( currentPost ); }
		);

		return ArticlesHtml;
	}

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

	buildSlideShowData ( ) {
		let slideShowDataArray = [];
		this.blogPosts.forEach (
			post => {
				slideShowDataArray.push (
					{
						scr : post.mediaPhotoFileName,
						date : Formater.formatDateTime ( post.photoIsoDate ),
						exif : post.photoTechInfo,
						cat : post.categories.toString ( ),
						class : 'cy' + post.photoHtmlClassName
					}
				);
			}
		);
		return JSON.stringify ( slideShowDataArray );
	}

	build ( ) {
		this.buildNavHtml ( );
	}

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default HtmlFilesBuilder;