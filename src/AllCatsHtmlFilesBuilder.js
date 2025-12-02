import theBlog from './Blog.js';
import Formater from './Formater.js';
import SinglePageHtmlFilesBuilder from './SinglePageHtmlFilesBuilder.js';
import fs from 'fs';
import theConfig from './Config.js';

class AllCatsHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

   	get rootDestDir ( ) { return 'allcats/'; }

	#sortBlog ( ) {
		theBlog.blogPosts.sort (
			( first, second ) => {
				if ( first.categories [ 0 ] > second.categories [ 0 ] ) {
					return 1;
				}
				else if ( first.categories [ 0 ] < second.categories [ 0 ] ) {
					return -1;
				}
				else if ( first.categories [ 0 ] === second.categories [ 0 ] ) {
					if ( first.photoIsoDate > second.photoIsoDate ) {
						return -1;
					}
					else if ( first.photoIsoDate < second.photoIsoDate ) {
						return 1;
					}
					if ( first.photoIsoDate === second.photoIsoDate ) {
						return 0;
					}
				}
			}
		);
	}

	buildArticlesHtml ( ) {
		this.#sortBlog ( );
		let heading = '';
		let articlesHtml = '';
		theBlog.blogPosts.forEach (
			post => {
				if ( heading !== post.categories [ 0 ] ) {
					if ( '' !== heading ) {
						articlesHtml += '</p>';
					}
					articlesHtml +=
                        '<h1>' + post.categories [ 0 ] + '</h1>';
					heading = post.categories [ 0 ];
				}
    		    let postInfos = post.categories.toString ( ) + ', ' + Formater.formatDateTime ( post.photoIsoDate );

				articlesHtml +=
                    '<a href="/posts/' + Formater.isoDateToUrlString ( post.photoIsoDate ) +
                    '/" title="' + postInfos +

                    '"><img src="/medias/photos/' + Formater.isoDateToUrlString ( post.photoIsoDate ) + '_s.WebP" title=" ' +
                    postInfos + '"></a>';
			}
		);
		articlesHtml += '</p>';

		return articlesHtml;
	}

   	get rootDestDir ( ) { return 'allcats/'; }

	buildPagesHtml ( ) {

		fs.mkdirSync (
			theConfig.destDir + this.rootDestDir, { recursive : true }
		);

		fs.writeFileSync (
			theConfig.destDir + this.rootDestDir + '/' + 'index.html',
			this.buildHtmlString ( )
		);
	}

	build ( ) {
		super.build ( );
		this.buildPagesHtml ( );
	}

	constructor ( ) {
		super ( );
	};
}

export default AllCatsHtmlFilesBuilder;