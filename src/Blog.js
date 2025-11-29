import fs from 'fs';
import theConfig from './Config.js';

class Blog {

	#blogAuthor;
	#blogTitle;
	#blogDescription;
	#blogHeading;
	#blogKeywords;
	#blogRobots;
	#blogPosts;
	#isValid;

	get blogAuthor ( ) { return this.#blogAuthor; }
	get blogTitle ( ) { return this.#blogTitle; }
	get blogDescription ( ) { return this.#blogDescription; }
	get blogHeading ( ) { return this.#blogHeading; }
	get blogKeywords ( ) { return this.#blogKeywords; }
	get blogRobots ( ) { return this.#blogRobots; }
	get blogPosts ( ) { return this.#blogPosts; }
	get isValid ( ) { return this.#isValid; }

	constructor ( blogPosts ) {
		this.#isValid = true;
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
			this.#blogPosts = blogPosts;
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
			this.#isValid &&= blogPosts;
		}
		catch {
			this.#isValid = false;
		}
	}
}

export default Blog;