/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
Doc reviewed ...
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theConfig from './Config.js';
import DirManager from './DirManager.js';
import theBlog from './Blog.js';
import fs from 'fs';
import MainHtmlFilesBuilder from './MainHtmlFilesBuilder.js';
import CatHtmlFilesBuilder from './CatHtmlFilesBuilder.js';
import PagesHtmlFilesBuilder from './PagesHtmlFilesBuilder.js';
import PostsHtmlFilesBuilder from './PostsHtmlFilesBuilder.js';
import AllCatsHtmlFilesBuilder from './AllCatsHtmlFilesBuilder.js';
import AllDatesHtmlFilesBuilder from './AllDatesHtmlFilesBuilder.js';
import JSSriptsFilesBuilder from './JSScriptsFilesBuilder.js';
import HtmlFilesBuilder from './HtmlFilesBuilder.js';
import BlogMediasBuilder from './BlogMediasBuilder.js';
import crypto from 'crypto';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class BlogFilesBuilder {

	/**
	 * Clean a css string, removing white space, tab, comments
	 * @param {String} cssString the string to clean
	 * @returns {String} the cleaned string
	 */

	#cleanCss ( cssString ) {
		let tmpCssString = cssString
			.replaceAll ( /\r/g, ' ' )
			.replaceAll ( /\n/g, ' ' )
			.replaceAll ( /\t/g, ' ' )
			.replaceAll ( /: /g, ':' )
			.replaceAll ( / :/g, ':' )
			.replaceAll ( / {/g, '{' )
			.replaceAll ( / {2,}/g, '' )
			.replaceAll ( /\u002F\u002A.*?\u002A\u002F/g, '' );

		return tmpCssString;

	}

	/**
	 *  Copy the js scripts, css and ico files to the correct directory
	 */

	#copyStyles ( ) {

		const destDir = theConfig.destDir + '/styles/';
		fs.mkdirSync ( destDir, { recursive : true } );

		let cssString = '';

		const fileNames = [
			'reset.css',
			'main.css',
			'pagination.css',
			'bigScreen.css',
			'mouse.css',
			'slideShow.css'
		];
		fileNames.forEach (
			fileName => {
				cssString += fs.readFileSync (
					'./srcStyles/' + fileName,
					'utf8'
				);
			}
		);

		cssString = this.#cleanCss ( cssString );

		fs.writeFileSync ( destDir + 'index.min.css', cssString );

		const hash = crypto.createHash ( 'sha384' )
			.update ( cssString, 'utf8' )
			.digest ( 'base64' );

		HtmlFilesBuilder.includes.style =
			'href="/styles/index.min.css" type="text/css" rel="stylesheet" media="screen" ' +
			'integrity="sha384-' + hash + '" ' +
			'crossorigin="anonymous"';

		fs.copyFileSync ( './srcStyles/right.png', destDir + 'right.png' );
		fs.copyFileSync ( './srcStyles/left.png', destDir + 'left.png' );
		fs.copyFileSync ( './srcStyles/opensans-regular.woff2', destDir + 'opensans-regular.woff2' );
	}

	/**
	 * Copy the robots.txt file to the correct directory.
	 * The process is stopped if the robots.txt sources are not found!
	 */

	#copyRobotsTxt ( ) {

		try {
			if ( fs.existsSync ( theConfig.srcDir + 'robots.txt' ) ) {

				// copy file if exists
				fs.copyFileSync ( theConfig.srcDir + 'robots.txt', theConfig.destDir + 'robots.txt' );
			}
			else {

				// stop ... missing file
				console.error ( '\n\x1b[31mThe file' + theConfig.srcDir + 'robots.txt was not found\x1b[0m' );
				process.exitCode = 1;
			}
		}
		catch ( err ) {

			// stop if an error occurs
			console.error ( err );
			console.error ( '\n\x1b[31mAn error occurs when copy the file' + theConfig.srcDir + 'robots.txt\x1b[0m' );
			process.exitCode = 1;
		}
	}

	/**
	 * Copy the .htaccess files to the correct directory.
	 * The process is stopped if the .htaccess sources are not found!
	 */

	#copyHtaccess ( ) {

		// .htaccess for root directory
		try {
			if ( fs.existsSync ( theConfig.srcDir + 'htaccess/root.htaccess' ) ) {

				// copy file if exists
				fs.copyFileSync ( theConfig.srcDir + 'htaccess/root.htaccess', theConfig.destDir + '.htaccess' );
			}
			else {

				// stop ... missing file
				console.error ( '\n\x1b[31mThe file' + theConfig.srcDir + 'htaccess/root.htaccess was not found\x1b[0m' );
				process.exitCode = 1;
				return;
			}
		}
		catch ( err ) {

			// stop if an error occurs
			console.error ( err );
			console.error ( '\n\x1b[31mAn error occurs when copy the file' + theConfig.srcDir + '.htaccess\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		// .htaccess for media directory
		try {
			if ( fs.existsSync ( theConfig.srcDir + 'htaccess/medias.htaccess' ) ) {

				// copy file if exists
				fs.copyFileSync ( theConfig.srcDir + 'htaccess/medias.htaccess', theConfig.destDir + 'medias/.htaccess' );
			}
			else {

				// stop ... missing file
				console.error ( '\n\x1b[31mThe file' + theConfig.srcDir + 'htaccess/medias.htaccess was not found\x1b[0m' );
				process.exitCode = 1;
				return;
			}
		}
		catch ( err ) {

			// stop if an error occurs
			console.error ( err );
			console.error ( '\n\x1b[31mAn error occurs when copy the file' + theConfig.srcDir + 'medias/.htaccess\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		// .htaccess for subdirectory
		const fileNames = fs.readdirSync ( theConfig.destDir );

		// Loop on the subdirectory
		for ( let filesCounter = 0; filesCounter < fileNames.length; filesCounter ++ ) {
			const fileName = fileNames [ filesCounter ];
			const lstat = fs.lstatSync ( theConfig.destDir + fileName );
			if (
				lstat.isDirectory ( )
				&&
				-1 === [ 'scripts', 'styles', 'medias', '401', '403', '404' ].indexOf ( fileName )
			  ) {
				try {
					if ( fs.existsSync ( theConfig.srcDir + 'htaccess/subdirectory.htaccess' ) ) {

						// copy file if exists
						fs.copyFileSync (
							theConfig.srcDir + 'htaccess/subdirectory.htaccess',
							theConfig.destDir + fileName + '/.htaccess'
						);
					}
					else {

						// stop ... missing file
						console.error (
							'\n\x1b[31mThe file' + theConfig.srcDir +
							'htaccess/subdirectory.htaccess was not found\x1b[0m'
						);
						process.exitCode = 1;
						return;
					}
				}
				catch ( err ) {

					// stop if an error occurs
					console.error ( err );
					console.error (
						'\n\x1b[31mAn error occurs when copy the file' + theConfig.srcDir + '.htaccess to ' +
						theConfig.destDir + fileName + '/\x1b[0m'
					);
					process.exitCode = 1;
					return;
				}
			}
		}
	}

	/**
	 * The the pages for http errors 401, 403, and 404
	 */

	#copyErrorPages ( ) {

		let destDir = theConfig.destDir + '/401/';
		fs.mkdirSync ( destDir, { recursive : true } );
		fs.copyFileSync ( './html/401.html', destDir + 'index.html' );

		destDir = theConfig.destDir + '/403/';
		fs.mkdirSync ( destDir, { recursive : true } );
		fs.copyFileSync ( './html/403.html', destDir + 'index.html' );

		destDir = theConfig.destDir + '/404/';
		fs.mkdirSync ( destDir, { recursive : true } );
		const htmlString = fs.readFileSync ( './html/404.html', 'utf8' )
			.replaceAll ( /{{PhotoWeb:blogAuthor}}/g, theBlog.blogAuthor )
			.replaceAll ( /{{PhotoWeb:blogTitle}}/g, theBlog.blogTitle + ' - Oufti bièsse, t\'es pierdou!' )
			.replaceAll ( /{{PhotoWeb:blogDescription}}/g, theBlog.blogDescription )
			.replaceAll ( /{{PhotoWeb:blogHeading}}/g, theBlog.blogHeading )
			.replaceAll ( /{{PhotoWeb:blogKeywords}}/g, theBlog.blogKeywords )
			.replaceAll ( /{{PhotoWeb:blogRobots}}/g, theBlog.blogRobots )
			.replaceAll ( /{{PhotoWeb:script}}/g, HtmlFilesBuilder.includes.script )
			.replaceAll ( /{{PhotoWeb:style}}/g, HtmlFilesBuilder.includes.style )
			.replaceAll ( /<!--.*?-->/g, '' )
			.replaceAll ( /\r\n|\r|\n/g, ' ' )
			.replaceAll ( /\t/g, ' ' )
			.replaceAll ( / {2,}/g, ' ' );
		fs.writeFileSync ( destDir + 'index.html', htmlString );
	}

	/**
	 * Build the css for the Oops page
	 * @returns {String} a string with all the needed data to put in the <link> tag
	 */

	#buildOopsCss ( ) {
		let cssString = this.#cleanCss (
			fs.readFileSync ( './srcStyles/Oops.css', 'utf8' )
		);
		const hash = crypto.createHash ( 'sha384' )
			.update ( cssString, 'utf8' )
			.digest ( 'base64' );

		fs.writeFileSync ( theConfig.destDir + '/styles/oops.min.css', cssString );

		return 'href="/styles/oops.min.css" type="text/css" rel="stylesheet" media="screen" ' +
			'integrity="sha384-' + hash + '" ' +
			'crossorigin="anonymous"';
	}

	/**
	 * Build and copy the Oops page
	 */

	async #copyOopsPage ( ) {
		const includeScript = await new JSSriptsFilesBuilder ( ).build ( './srcScripts/oops.js' );

		const includeStyle = this.#buildOopsCss ( );
		const oopsPage = fs.readFileSync ( './html/home.html', 'utf8' )
			.replaceAll ( /{{PhotoWeb:script}}/g, includeScript )
			.replaceAll ( /{{PhotoWeb:style}}/g, includeStyle )
			.replaceAll ( /<!--.*?-->/g, '' )
			.replaceAll ( /\r\n|\r|\n/g, ' ' )
			.replaceAll ( /\t/g, ' ' )
			.replaceAll ( / {2,}/g, ' ' );
		fs.writeFileSync ( theConfig.destDir + 'index.html', oopsPage );
	}

	/**
	 * Copy all the files that are in the directore /others/
	 */

	#copyOthers ( ) {
		const srcDir = theConfig.srcDir + 'others/';
		const destDir = theConfig.destDir;
		if ( ! fs.existsSync ( srcDir ) ) {
			return;
		}
		fs.cpSync ( srcDir, destDir, { recursive : true } );
	}

	/**
	 * Build the complete blog
	 */

	async build ( ) {

		// loading blog data
		await theBlog.loadData ( );

		if ( ! theBlog.isValid ) {

			// Stop if a problem occurrs when loading blog data
			process.exitCode = 1;
			return;
		}

		// clening the destination directory. Stop the proccess if the cleaning fails
		if ( ! DirManager.cleanDir ( theConfig.destDir ) ) {
			console.error ( '\n\x1b[31mNot possible to clean the $dir folder\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		// copy the photos
		await new BlogMediasBuilder ( ).build ( );

		// copy the css files
		this.#copyStyles ( );

		// copy the ico
		fs.copyFileSync ( theConfig.srcDir + 'favicon.ico', theConfig.destDir + 'favicon.ico' );

		// copy the js
		HtmlFilesBuilder.includes.script = await new JSSriptsFilesBuilder ( ).build ( './srcScripts/index.js' );
		if ( 1 === process.exitCode ) {
			return;
		}

		this.#copyOopsPage ( );

		this.#copyErrorPages ( );

		// building the pages
		new MainHtmlFilesBuilder ( ).build ( );
		new CatHtmlFilesBuilder ( ).build ( );
		new PagesHtmlFilesBuilder ( ).build ( );
		new PostsHtmlFilesBuilder ( ).build ( );
		new AllDatesHtmlFilesBuilder ( ).build ( );
		new AllCatsHtmlFilesBuilder ( ).build ( );

		// copy the robots.txt
		this.#copyRobotsTxt ( );
		if ( 1 === process.exitCode ) {
			return;
		}

		// copy the htaccess files
		this.#copyHtaccess ( );
		if ( 1 === process.exitCode ) {
			return;
		}

		this.#copyOthers ( );

		// Everything ok. Return with process.exitCode = 0
		process.exitCode = 0;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );

	}
}

export default BlogFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */