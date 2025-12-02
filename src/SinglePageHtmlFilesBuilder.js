import HtmlFilesBuilder from './HtmlFilesBuilder.js';

class SinglePageHtmlFilesBuilder extends HtmlFilesBuilder {

	buildPaginationHtml ( ) {
		let returnValue =
			'<div id="cyPagination">' +
			'<div id="cyPaginationTopArrow">⮝</div>' +
			'<div id="cyPaginationTop"><a href="/main/1/" title="Retourner à l\'accueil">Retourner à l\'accueil</a></div>' +
            '</div>';
		return returnValue;
	}

 	get blogPosts ( ) { return []; }

	constructor ( ) {
		super ( );
	}
}

export default SinglePageHtmlFilesBuilder;