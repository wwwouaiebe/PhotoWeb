import theConfig from './Config.js';
import DirManager from './DirManager.js';
import Blog from './Blog.js';
import fs from 'fs';
import PhotoExifExctractor from './PhotoExifExtractor.js';

class BlogBuilder {

	#blog;

	#homePage;

	#currentPosts = [];

	#htmlString;

	#currentPageNumber;

	#postsPerPage = 5;

	#currentPostDate = '';

	#slideShowData = '';

	#formatDate ( isoDate ) {
		const tmpDate = new Date ( isoDate );
		const days = [ 'dimanche ', 'lundi ', 'mardi ', 'mercredi ', 'jeudi ', 'vendredi ', 'samedi ' ];
		const months = [
			' janvier ',
			' février ',
			' mars ',
			' avril ',
			' mai ',
			' juin  ',
			' juillet ',
			' août ',
			' septembre ',
			' octobre ',
			' novembre ',
			'décembre '
		];
		return days [ tmpDate.getDay ( ) ] + tmpDate.getDate ( ) + months [ tmpDate. getMonth ( ) ] + tmpDate.getFullYear ( );
	}

	#formatDateTime ( isoDate ) {
		// eslint-disable-next-line no-unused-vars
		const [ hours, minutes, seconds ] = isoDate.split ( 'T' ) [ 1 ].split ( ':' ).map ( value => Number ( value ) );
		return this.#formatDate ( isoDate ) + ' ' +
            hours + ( 1 < hours ? ' heures ' : ' heure ' ) + minutes;
	}

	#buildPostHtml ( post ) {
		let postInfos = post.categories.toString ( ) + ', ' + this.#formatDateTime ( post.photoIsoDate );
		let postHtml =
            '<article"><figure><img class="cy' + post.photoHtmlClassName +
            '" width="' + post.photoWidth + '" height="' + post.photoHeight +
            '" src="' + post.mediaPhotoFileName + '"' +
            '" title="' + postInfos +
            '" alt="' + postInfos +
            '" <figcaption>' +
            '<p class="cyPictureInfo"><span>📷</span><span>' + post.photoTechInfo + '</span></p>' +
            '</figcaption></figure></article>';
		return postHtml;
	}

	#buildPageHtml ( ) {
		let postsHtml = '';

		this.#currentPosts.forEach (
			currentPost => { postsHtml += this.#buildPostHtml ( currentPost ); }
		);
		this.#htmlString = this.#htmlString.replaceAll ( '{{PhotoWeb:blogPosts}}', postsHtml );

	}

	#buildHomeHtml ( blogPosts ) {
		this.#currentPageNumber = 0;
		while ( this.#currentPageNumber < Math.ceil ( blogPosts.length / this.#postsPerPage ) ) {
			this.#htmlString = fs.readFileSync ( './html/home.html', { encoding : 'utf8' } );
			this.#currentPosts = blogPosts.slice (
				this.#currentPageNumber * this.#postsPerPage,
				( this.#currentPageNumber + 1 ) * this.#postsPerPage
			);
			this.#currentPageNumber ++;
			this.#buildPageHtml ( );

			this.#htmlString = this.#htmlString
				.replaceAll ( /{{PhotoWeb:blogAuthor}}/g, this.#blog.blogAuthor )
				.replaceAll ( /{{PhotoWeb:blogTitle}}/g, this.#blog.blogTitle )
				.replaceAll ( /{{PhotoWeb:blogDescription}}/g, this.#blog.blogDescription )
				.replaceAll ( /{{PhotoWeb:blogHeading}}/g, this.#blog.blogHeading )
				.replaceAll ( /{{PhotoWeb:blogKeywords}}/g, this.#blog.blogKeywords )
				.replaceAll ( /{{PhotoWeb:blogRobots}}/g, this.#blog.blogRobots )
				.replaceAll ( /{{PhotoWeb:SlideShowData}}/g, this.#slideShowData );
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
						date : this.#formatDateTime ( post.photoIsoDate ),
						exif : post.photoTechInfo,
						cat : post.categories.toString ( ),
						class : 'cy' + post.photoHtmlClassName
					}
				);
			}
		);

		this.#slideShowData = JSON.stringify ( slideShowDataArray );

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

		this.#buildSlideShowData ( this.#blog.blogPosts );

		this.#buildHomeHtml ( this.#blog.blogPosts );

		process.exitCode = 0;

	}

	constructor ( ) {

	}
}

export default BlogBuilder;