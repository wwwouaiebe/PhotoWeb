import HtmlBuilder from './HtmlBuilder.js';
import theBlog from './Blog.js';

class MainHtmlBuilder extends HtmlBuilder {

	get rootDestDir ( ) { return 'main/'; }

	build ( ) {
		this.buildNavHtml ( );
		this.buildPagesHtml ( theBlog.blogPosts );
	}

	constructor ( ) {
		super ( );
	}

}

export default MainHtmlBuilder;