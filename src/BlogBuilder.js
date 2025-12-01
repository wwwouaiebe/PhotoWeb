import theConfig from './Config.js';
import DirManager from './DirManager.js';
import Blog from './Blog.js';
import fs from 'fs';
import PhotoExifExctractor from './PhotoExifExtractor.js';
import Formater from './Formater.js';
import sharp from 'sharp';
import CategoriesCollection from './CategoriesCollection.js';

class BlogBuilder {

	static get #pageTypeEnum ( ) {
		return {
			main : 1,
			category : 2,
			page : 3
		};
	}

	#pageType;

	#blog;

	#currentPosts = [];

	#htmlString;

	#currentPageNumber;

	#currentFormatedDate;

	#currentCategory;

	#totalPagesNumber;

	#postsPerPage = 5;

	#categoriesCollection;

	#nav;

	#buildPagination ( ) {
		let returnValue =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>';

		if ( 1 !== this.#currentPageNumber ) {
			returnValue +=
				'<div id="cyPaginationNewestArrow">⮜</div>' +
				'<div id="cyPaginationNewest"><a href="/page/' +
				( this.#currentPageNumber - 1 ) +
				 '/" title="Photos plus récentes">Photos plus récentes</a></div>';
		}

		if ( this.#totalPagesNumber !== this.#currentPageNumber ) {
			returnValue +=
					'<div id="cyPaginationOldestArrow">⮞</div>' +
					'<div id="cyPaginationOldest"><a href="/page/' +
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

	#buildNavHtml ( ) {
		this.#nav = fs.readFileSync ( theConfig.srcDir + 'menu/menu.html', { encoding : 'utf8' } );
		this.#nav = this.#nav.replaceAll ( /{{PhotoWeb:navTop}}/g, this.#buildNavTopHtml ( ) );
	}

	#buildNavTopHtml ( ) {
		let navTop = '';
		this.#categoriesCollection.getParentCategories ( ).forEach (
			parentCategory => {
				navTop +=
					'<span><a href="/' + Formater.toUrlString ( parentCategory.name ) +
					'/" title="' + parentCategory.name + '">' + parentCategory.name + '</a></span>';
			}
		);
		return navTop;
	}

	#getCategoryLinksHtml ( categoryName ) {
		let categoryLinksHtml = '';
		let parentCategory = null;
		let childrenCategory = this.#categoriesCollection.getCategory ( categoryName );
		if ( childrenCategory.parent ) {
			parentCategory = this.#categoriesCollection.getCategory ( childrenCategory.parent );
			categoryLinksHtml =
			'<a href="/' + Formater.toUrlString ( parentCategory.name ) + '/" title="' + parentCategory.name + '" >' +
			parentCategory.name + '</a> ';
		}
		categoryLinksHtml +=
			'<a href="/' + Formater.toUrlString ( childrenCategory.name ) + '/" title="' + childrenCategory.name + '" >' +
			childrenCategory.name + '</a> ';

		return categoryLinksHtml;
	}

	#buildArticleHtml ( post ) {
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

	#buildArticlesHtml ( ) {

		this.#currentFormatedDate = '';
		let ArticlesHtml = '';

		this.#currentPosts.forEach (
			currentPost => { ArticlesHtml += this.#buildArticleHtml ( currentPost ); }
		);

		return ArticlesHtml;
	}

	#buildPagesHtml ( blogPosts ) {
		this.#buildSlideShowData ( blogPosts );
		this.#currentPageNumber = 0;
		this.#totalPagesNumber = Math.ceil ( blogPosts.length / this.#postsPerPage );
		while ( this.#currentPageNumber < this.#totalPagesNumber ) {
			this.#htmlString = fs.readFileSync ( './html/page.html', { encoding : 'utf8' } );
			this.#currentPosts = blogPosts.slice (
				this.#currentPageNumber * this.#postsPerPage,
				( this.#currentPageNumber + 1 ) * this.#postsPerPage
			);
			this.#currentPageNumber ++;

			this.#htmlString = this.#htmlString
				.replaceAll ( /{{PhotoWeb:blogAuthor}}/g, this.#blog.blogAuthor )
				.replaceAll ( /{{PhotoWeb:blogTitle}}/g, this.#blog.blogTitle )
				.replaceAll ( /{{PhotoWeb:blogDescription}}/g, this.#blog.blogDescription )
				.replaceAll ( /{{PhotoWeb:blogHeading}}/g, this.#blog.blogHeading )
				.replaceAll ( /{{PhotoWeb:blogKeywords}}/g, this.#blog.blogKeywords )
				.replaceAll ( /{{PhotoWeb:blogRobots}}/g, this.#blog.blogRobots )
				.replaceAll ( /{{PhotoWeb:SlideShowData}}/g, this.#buildSlideShowData ( blogPosts ) )
				.replaceAll ( /{{PhotoWeb:articles}}/g, this.#buildArticlesHtml ( ) )
				.replaceAll ( /{{PhotoWeb:pagination}}/g, this.#buildPagination ( ) )
				.replaceAll ( /{{PhotoWeb:nav}}/g, this.#nav );
			let destDir = '';
			switch ( this.#pageType ) {
			case BlogBuilder.#pageTypeEnum.main :
				destDir = 'main/';
				break;
			case BlogBuilder.#pageTypeEnum.category :
				destDir = 'cat/' + Formater.toUrlString ( this.#currentCategory.name ) + '/';
				break;
			default : break;
			}

			fs.mkdirSync ( theConfig.destDir + destDir + this.#currentPageNumber + '/', { recursive : true } );

			fs.writeFileSync (
				theConfig.destDir + destDir + this.#currentPageNumber + '/' + 'index.html', this.#htmlString
			);
		}
	}

	#buildSlideShowData ( blogPosts ) {
		let slideShowDataArray = [];
		blogPosts.forEach (
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

	async #copyPhotos ( ) {
		const destDir = theConfig.destDir + '/medias/photos/';
		fs.mkdirSync ( destDir, { recursive : true } );
		this.#blog.blogPosts.forEach (
			async post => {
				await sharp ( post.photoSrcFileName )
					.keepIccProfile ( )
					.withExif (
						{
							IFD0 : {
								Copyright : 'wwwouaiebe contact https://www.ouaie.be/',
								Artist : 'wwwouaiebe contact https://www.ouaie.be/'
							}
						}
					)
					.toFile ( destDir + post.photoIsoDate.replaceAll ( /:/g, '' ) + '.WebP' );
			}
		);
	}

	#copyStylesScriptsIco ( ) {
		let destDir = theConfig.destDir + '/scripts/';
		fs.mkdirSync ( destDir, { recursive : true } );
		let fileNames = fs.readdirSync ( theConfig.distDir + '/scripts/' );
		fileNames.forEach (
			fileName => {
				fs.copyFileSync ( theConfig.distDir + '/scripts/' + fileName, theConfig.destDir + '/scripts/' + fileName );
			}
		);

		fs.copyFileSync ( theConfig.srcDir + 'favicon.ico', theConfig.destDir + 'favicon.ico' );

		destDir = theConfig.destDir + '/styles/';
		fs.mkdirSync ( destDir, { recursive : true } );
		fileNames = fs.readdirSync ( theConfig.distDir + '/styles/' );
		fileNames.forEach (
			fileName => {
				fs.copyFileSync ( theConfig.distDir + '/styles/' + fileName, theConfig.destDir + '/styles/' + fileName );
			}
		);
		fs.copyFileSync ( theConfig.srcDir + 'favicon.ico', theConfig.destDir + 'favicon.ico' );
	}

	#buildHomeHtml ( ) {
		fs.copyFileSync ( './html/home.html', theConfig.destDir + 'index.html' );
	}

	#getCategoryPosts ( categoryName ) {
		return this.#blog.blogPosts.filter (
			post => post.categories.includes ( categoryName )
		);
	}

	async build ( ) {

		const photoExifExtractor = new PhotoExifExctractor ( );
		this.#blog = new Blog (
			await photoExifExtractor.exctract ( )
		);
		if ( ! this.#blog.isValid ) {
			process.exitCode = 1;
			return;
		}
		if ( ! DirManager.removeDir ( theConfig.destDir ) ) {
			console.error ( '\x1b[31mNot possible to clean the $dir folder\x1b[0m' );
			process.exitCode = 1;
			return;
		}
		this.#categoriesCollection = new CategoriesCollection ( this.#blog.blogPosts );
		this.#copyPhotos ( );
		this.#copyStylesScriptsIco ( );
		this.#buildHomeHtml ( );
		this.#buildNavHtml ( );
		this.#pageType = BlogBuilder.#pageTypeEnum.main;
		this.#buildPagesHtml ( this.#blog.blogPosts );
		this.#pageType = BlogBuilder.#pageTypeEnum.category;
		this.#categoriesCollection.getCategories ( ).forEach (
			category => {
				this.#currentCategory = category;
				this.#buildPagesHtml ( this.#getCategoryPosts ( category.name ) );
			}
		);

		process.exitCode = 0;
	}

	constructor ( ) {
		Object.freeze ( this );

	}
}

export default BlogBuilder;