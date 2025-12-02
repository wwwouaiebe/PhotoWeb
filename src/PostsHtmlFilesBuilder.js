import SinglePageHtmlFilesBuilder from './SinglePageHtmlFilesBuilder.js';
import theBlog from './Blog.js';
import fs from 'fs';
import theConfig from './Config.js';
import Formater from './Formater.js';

class PostsHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

	#htmlString;

	#post;

	get rootDestDir ( ) { return 'posts/'; }

	buildArticlesHtml ( ) {
		return this.buildArticleHtml ( this.#post );
	}

	buildPagesHtml ( post ) {
		this.#post = post;

		const destDir = theConfig.destDir + this.rootDestDir + Formater.isoDateToUrlString ( this.#post.photoIsoDate );
		fs.mkdirSync ( destDir, { recursive : true } );

		fs.writeFileSync (
			destDir + '/' + 'index.html',
			this.buildHtmlString ( ) );
	}

	build ( ) {
		super.build ( );
		theBlog.blogPosts.forEach (
			post => {
				this.buildPagesHtml ( post );
			}
		);
	}

	constructor ( ) {
		super ( );
		Object.freeze ( this );
	}

}

export default PostsHtmlFilesBuilder;