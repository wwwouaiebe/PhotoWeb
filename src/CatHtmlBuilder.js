import HtmlBuilder from './HtmlBuilder.js';
import theBlog from './Blog.js';
import Formater from './Formater.js';

class CatHtmlBuilder extends HtmlBuilder {

	#category;

	get rootDestDir ( ) { return 'cat/' + Formater.toUrlString ( this.#category.name ) + '/'; }

	build ( ) {
		this.buildNavHtml ( );
		theBlog.blogCategories.getCategories ( ).forEach (
			category => {
				this.#category = category;
				this.buildPagesHtml ( theBlog.getCategoryPosts ( category.name ) );
			}
		);
	}

	constructor ( ) {
		super ( );
	}

}

export default CatHtmlBuilder;