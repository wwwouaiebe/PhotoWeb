import fs from 'fs';
import theConfig from './Config.js';
import CategoriesCollection from './CategoriesCollection.js';
import PhotoExifExtractor from './PhotoExifExtractor.js';

class Blog {

	#blogAuthor;
	#blogTitle;
	#blogDescription;
	#blogHeading;
	#blogKeywords;
	#blogRobots;
	#blogPosts;
	#isValid;
	#blogCategories;
	#areDataLoaded;

	get blogAuthor ( ) { return this.#blogAuthor; }
	get blogTitle ( ) { return this.#blogTitle; }
	get blogDescription ( ) { return this.#blogDescription; }
	get blogHeading ( ) { return this.#blogHeading; }
	get blogKeywords ( ) { return this.#blogKeywords; }
	get blogRobots ( ) { return this.#blogRobots; }
	get blogPosts ( ) { return this.#blogPosts; }
	get isValid ( ) { return this.#isValid && this.#areDataLoaded; }
	get blogCategories ( ) { return this.#blogCategories; }

	getCategoryPosts ( categoryName ) {
		return this.#blogPosts.filter (
			post => post.categories.includes ( categoryName )
		);
	}

	async loadData ( ) {
		if ( this.#areDataLoaded ) {
			return;
		}
		const photoExifExtractor = new PhotoExifExtractor ( );
		this.#blogPosts = await photoExifExtractor.exctract ( );
		try {
			const blogData = JSON.parse (
				fs.readFileSync ( theConfig.srcDir + 'blog.json', { encoding : 'utf8' } )
			);
			this.#blogAuthor = blogData.blogAuthor;
			this.#blogTitle = blogData.blogTitle;
			this.#blogDescription = blogData.blogDescription;
			this.#blogHeading = blogData.blogHeading;
			this.#blogKeywords = blogData.blogKeywords;
			this.#blogRobots = blogData.blogRobots;
			this.#blogPosts.sort (
				( first, second ) => {
					if ( first.photoIsoDate > second.photoIsoDate ) {
						return -1;
					}
					else if ( first.photoIsoDate < second.photoIsoDate ) {
						return 1;
					}
					return 0;
				}
			);

			this.#blogCategories = new CategoriesCollection ( this.#blogPosts );
			this.#isValid &&= this.#blogPosts;
		}
		catch ( err ) {
			console.error ( err );
			this.#isValid = false;
		}
		this.#areDataLoaded = true;
	}

	constructor ( ) {
		this.#isValid = true;
		this.#areDataLoaded = false;

	}
}

const theBlog = new Blog ( );

export default theBlog;