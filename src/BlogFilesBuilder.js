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
import sharp from 'sharp';
import MainHtmlFilesBuilder from './MainHtmlFilesBuilder.js';
import CatHtmlFilesBuilder from './CatHtmlFilesBuilder.js';
import PagesHtmlFilesBuilder from './PagesHtmlFilesBuilder.js';
import PostsHtmlFilesBuilder from './PostsHtmlFilesBuilder.js';
import AllCatsHtmlFilesBuilder from './AllCatsHtmlFilesBuilder.js';
import AllDatesHtmlFilesBuilder from './AllDatesHtmlFilesBuilder.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class BlogFilesBuilder {

	/**
	 * Copy the blog's photos to the correct directory, remove the exif data, add a copyright and an artist in the exif data,
	 * transform jpg to Webp and create a reducted photo
	 */

	async #copyPhotos ( ) {
		const destDir = theConfig.destDir + '/medias/photos/';
		fs.mkdirSync ( destDir, { recursive : true } );
		for ( let postCounter = 0; postCounter < theBlog.blogPosts.length; postCounter ++ ) {
			let post = theBlog.blogPosts [ postCounter ];
			await sharp ( post.photoSrcFileName )
				.keepIccProfile ( )
				.withExif (
					{
						IFD0 : {
							Copyright : 'wwwouaiebe contact https://www.ouaie.be/',
							Artist : 'wwwouaiebe contact https://www.ouaie.be/'
						}
					}
				)
				.toFile ( destDir + post.photoIsoDate.replaceAll ( /:/g, '' ) + '.WebP' );
			await sharp ( post.photoSrcFileName )
				.keepIccProfile ( )
				.withExif (
					{
						IFD0 : {
							Copyright : 'wwwouaiebe contact https://www.ouaie.be/',
							Artist : 'wwwouaiebe contact https://www.ouaie.be/'
						}
					}
				)
				.resize ( { height : 162 } )
				.toFile ( ( destDir + post.photoIsoDate.replaceAll ( /:/g, '' ) + '_s.WebP' ) );
		}
	}

	/**
	 *  Copy the js scripts, css and ico files to the correct directory
	 */

	#copyStylesScriptsIco ( ) {
		let destDir = theConfig.destDir + '/scripts/';
		fs.mkdirSync ( destDir, { recursive : true } );
		let fileNames = fs.readdirSync ( theConfig.distDir + '/scripts/' );
		fileNames.forEach (
			fileName => {
				fs.copyFileSync ( theConfig.distDir + '/scripts/' + fileName, theConfig.destDir + '/scripts/' + fileName );
			}
		);

		fs.copyFileSync ( theConfig.srcDir + 'favicon.ico', theConfig.destDir + 'favicon.ico' );
		fs.copyFileSync ( theConfig.srcDir + 'robots.txt', theConfig.destDir + 'robots.txt' );

		destDir = theConfig.destDir + '/styles/';
		fs.mkdirSync ( destDir, { recursive : true } );
		fileNames = fs.readdirSync ( theConfig.distDir + '/styles/' );
		fileNames.forEach (
			fileName => {
				fs.copyFileSync ( theConfig.distDir + '/styles/' + fileName, theConfig.destDir + '/styles/' + fileName );
			}
		);
		fs.copyFileSync ( theConfig.srcDir + 'favicon.ico', theConfig.destDir + 'favicon.ico' );
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
				console.error ( '\n\x1b[31mTthe file' + theConfig.srcDir + 'robots.txt was not found\x1b[0m' );
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
				console.error ( '\n\x1b[31mTthe file' + theConfig.srcDir + 'htaccess/root.htaccess was not found\x1b[0m' );
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
				console.error ( '\n\x1b[31mTthe file' + theConfig.srcDir + 'htaccess/medias.htaccess was not found\x1b[0m' );
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
			if ( lstat.isDirectory ( ) && 'medias' !== fileName ) {
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
							'\n\x1b[31mTthe file' + theConfig.srcDir +
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
		await this.#copyPhotos ( );

		// copy the scrips, css files and ico files
		this.#copyStylesScriptsIco ( );

		// copy the home page
		fs.copyFileSync ( './html/home.html', theConfig.destDir + 'index.html' );

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