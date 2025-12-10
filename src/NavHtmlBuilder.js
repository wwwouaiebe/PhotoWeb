import fs from 'fs';
import theBlog from './Blog.js';
import theConfig from './Config.js';
import Formater from './Formater.js';

class NavHtmlBuilder {

	#navHtml;

	get navHtml ( ) {
		if ( this.#navHtml ) {
			return this.#navHtml;
		}

		this.#buildNavHtml ( );
		return this.#navHtml;

	}

	#buildAllCatsHtmlMenu ( ) {
		let categoriesHtmlMenu = '';

		// loop on the blog categories
		theBlog.blogCategories.getParentCategories ( ).forEach (
			parentCategory => {
				categoriesHtmlMenu +=
					'<span><a href="/cat/' + Formater.toUrlString ( parentCategory.name ) +
					'/1/" title="' + parentCategory.name + '"> ' + parentCategory.name + '</a> </span>';
			}
		);
		return categoriesHtmlMenu;
	}

	#buildNavHtml ( ) {

		// reading the menu
		this.#navHtml = fs.readFileSync ( theConfig.srcDir + 'menu/menu.html', { encoding : 'utf8' } );

		// replacing the {{PhotoWeb:navTop}} tag
		this.#navHtml = this.#navHtml.replaceAll ( /{{PhotoWeb:navAllCats}}/g, this.#buildAllCatsHtmlMenu ( ) );
	}

	constructor ( ) {

	}

}

const theNavHtmlBuilder = new NavHtmlBuilder ( );

export default theNavHtmlBuilder;