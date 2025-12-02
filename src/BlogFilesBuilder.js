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

class BlogFilesBuilder {

	async #copyPhotos ( ) {
		const destDir = theConfig.destDir + '/medias/photos/';
		fs.mkdirSync ( destDir, { recursive : true } );
		theBlog.blogPosts.forEach (
			async post => {
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
		);
	}

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

	async build ( ) {

		await theBlog.loadData ( );

		if ( ! theBlog.isValid ) {
			process.exitCode = 1;
			return;
		}
		if ( ! DirManager.removeDir ( theConfig.destDir ) ) {
			console.error ( '\x1b[31mNot possible to clean the $dir folder\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		this.#copyPhotos ( );
		this.#copyStylesScriptsIco ( );

		fs.copyFileSync ( './html/home.html', theConfig.destDir + 'index.html' );

		new MainHtmlFilesBuilder ( ).build ( );
		new CatHtmlFilesBuilder ( ).build ( );
		new PagesHtmlFilesBuilder ( ).build ( );
		new PostsHtmlFilesBuilder ( ).build ( );
		new AllDatesHtmlFilesBuilder ( ).build ( );
		new AllCatsHtmlFilesBuilder ( ).build ( );
		process.exitCode = 0;
	}

	constructor ( ) {
		Object.freeze ( this );

	}
}

export default BlogFilesBuilder;