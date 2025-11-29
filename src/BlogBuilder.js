import theConfig from './Config.js';
import DirManager from './DirManager.js';
import Blog from './Blog.js';
import fs from 'fs';
import PhotoExifExctractor from './PhotoExifExtractor.js';
import Formater from './Formatter.js';
import sharp from 'sharp';
import CategoriesCollection from './CategoriesCollection.js';

class BlogBuilder {

	#blog;

	#currentPosts = [];

	#htmlString;

	#currentPageNumber;

	#postsPerPage = 5;

	#categoriesCollection;

	#buildArticleHtml ( post ) {
		let postInfos = post.categories.toString ( ) + ', ' + Formater.formatDateTime ( post.photoIsoDate );
		return '<article"><figure><img class="cy' + post.photoHtmlClassName +
            '" width="' + post.photoWidth + '" height="' + post.photoHeight +
            '" src="' + post.mediaPhotoFileName + '"' +
            '" title="' + postInfos +
            '" alt="' + postInfos +
            '" <figcaption>' +
            '<p class="cyPictureInfo"><span>📷</span><span>' + post.photoTechInfo + '</span></p>' +
            '</figcaption></figure></article>';
	}

	#buildArticlesHtml ( ) {
		let ArticlesHtml = '';

		this.#currentPosts.forEach (
			currentPost => { ArticlesHtml += this.#buildArticleHtml ( currentPost ); }
		);

		return ArticlesHtml;
	}

	#buildPageHtml ( blogPosts ) {
		this.#buildSlideShowData ( blogPosts );
		this.#currentPageNumber = 0;
		while ( this.#currentPageNumber < Math.ceil ( blogPosts.length / this.#postsPerPage ) ) {
			this.#htmlString = fs.readFileSync ( './html/home.html', { encoding : 'utf8' } );
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
				.replaceAll ( /{{PhotoWeb:articles}}/g, this.#buildArticlesHtml ( ) );
			if ( 1 === this.#currentPageNumber ) {
				fs.writeFileSync ( theConfig.destDir + 'index.html', this.#htmlString );
			}
			else {
				fs.mkdirSync ( theConfig.destDir + 'page/' + this.#currentPageNumber + '/', { recursive : true } );
				fs.writeFileSync (
					theConfig.destDir + 'page/' + this.#currentPageNumber + '/' + 'index.html', this.#htmlString
				);
			}
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

		this.#buildPageHtml ( this.#blog.blogPosts );

		process.exitCode = 0;

	}

	constructor ( ) {

	}
}

export default BlogBuilder;