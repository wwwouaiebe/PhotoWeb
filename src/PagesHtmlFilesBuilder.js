import SinglePageHtmlFilesBuilder from './SinglePageHtmlFilesBuilder.js';
import theBlog from './Blog.js';
import Formater from './Formater.js';
import fs from 'fs';
import theConfig from './Config.js';

class PagesHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

	#htmlString;

	#page;

	get rootDestDir ( ) { return 'pages/'; }

	buildArticlesHtml ( ) {
		return '<h1>' + this.#page.pageName + '</h1>' + this.#page.pageContent;
	}

	get htmlStringFile ( ) {
		return './html/page.html';
	}

	buildPagesHtml ( page ) {
		this.#page = page;

		fs.mkdirSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( this.#page.pageName ) + '/', { recursive : true }
		);

		fs.writeFileSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( page.pageName ) + '/' + 'index.html',
			this.buildHtmlString ( )
		);
	}

	build ( ) {
		super.build ( );
		theBlog.blogPages.forEach (
			page => {
				this.buildPagesHtml ( page );
			}
		);
	}

	constructor ( ) {
		super ( );
	}

}

export default PagesHtmlFilesBuilder;