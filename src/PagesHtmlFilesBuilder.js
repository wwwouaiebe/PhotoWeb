import HtmlFilesBuilder from './HtmlFilesBuilder.js';
import theBlog from './Blog.js';
import Formater from './Formater.js';
import fs from 'fs';
import theConfig from './Config.js';

class PagesHtmlFilesBuilder extends HtmlFilesBuilder {

	#htmlString;

	#page;

	get rootDestDir ( ) { return 'pages/'; }

	#buildArticlesHtml ( ) {
		return '<h1>' + this.#page.pageName + '</h1>' + this.#page.pageContent;
	}

	#buildSlideShowData ( ) {
		return '[]';
	}

	#buildPaginationHtml ( ) {
		let returnValue =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/main/1/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>' +
            '</div>';
		return returnValue;
	}

	buildPagesHtml ( page ) {
		this.#page = page;
		this.#htmlString = fs.readFileSync ( './html/page.html', { encoding : 'utf8' } );

		this.#htmlString = this.#htmlString
			.replaceAll ( /{{PhotoWeb:blogAuthor}}/g, theBlog.blogAuthor )
			.replaceAll ( /{{PhotoWeb:blogTitle}}/g, theBlog.blogTitle )
			.replaceAll ( /{{PhotoWeb:blogDescription}}/g, theBlog.blogDescription )
			.replaceAll ( /{{PhotoWeb:blogHeading}}/g, theBlog.blogHeading )
			.replaceAll ( /{{PhotoWeb:blogKeywords}}/g, theBlog.blogKeywords )
			.replaceAll ( /{{PhotoWeb:blogRobots}}/g, theBlog.blogRobots )
			.replaceAll ( /{{PhotoWeb:SlideShowData}}/g, this.#buildSlideShowData ( ) )
		    .replaceAll ( /{{PhotoWeb:articles}}/g, this.#buildArticlesHtml ( ) )
		    .replaceAll ( /{{PhotoWeb:pagination}}/g, this.#buildPaginationHtml ( ) )
		    .replaceAll ( /{{PhotoWeb:nav}}/g, this.navHtml );

		fs.mkdirSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( this.#page.pageName ) + '/', { recursive : true }
		);

		fs.writeFileSync (
			theConfig.destDir + this.rootDestDir + Formater.toUrlString ( page.pageName ) + '/' + 'index.html',
			this.#htmlString
		);
	}

	build ( ) {
		this.buildNavHtml ( );
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