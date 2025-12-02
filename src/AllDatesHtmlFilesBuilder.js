import theBlog from './Blog.js';
import Formater from './Formater.js';
import SinglePageHtmlFilesBuilder from './SinglePageHtmlFilesBuilder.js';
import fs from 'fs';
import theConfig from './Config.js';

class AllDatesHtmlFilesBuilder extends SinglePageHtmlFilesBuilder {

   	get rootDestDir ( ) { return 'alldates/'; }

	buildArticlesHtml ( ) {
		let heading = '';
		let articlesHtml = '';
		theBlog.blogPosts.forEach (
			post => {
				let postMonthYear = Formater.isoDateToMonthYear ( post.photoIsoDate );
				if ( heading !== postMonthYear ) {
					if ( '' !== heading ) {
						articlesHtml += '</p>';
					}
					heading = postMonthYear;
					articlesHtml +=
                        '<h1>' + postMonthYear + '</h1>';
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

export default AllDatesHtmlFilesBuilder;