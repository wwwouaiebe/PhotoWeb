import HtmlFilesBuilder from './HtmlFilesBuilder.js';
import theBlog from './Blog.js';

class MainHtmlFilesBuilder extends HtmlFilesBuilder {

	get rootDestDir ( ) { return 'main/'; }

	build ( ) {
		super.build ( );
		this.buildPagesHtml ( theBlog.blogPosts );
	}

	constructor ( ) {
		super ( );
	}

}

export default MainHtmlFilesBuilder;