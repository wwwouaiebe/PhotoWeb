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
import fs from 'fs';
import theBlog from './Blog.js';
import sharp from 'sharp';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A class for building the media files
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class BlogMediasBuilder {

	/**
	 * The new exif data to push in the photos
	 * @type {Object}
	 */

	#newExifData = {
		IFD0 : {
			Copyright : 'wwwouaiebe contact https://www.ouaie.be/',
			Artist : 'wwwouaiebe contact https://www.ouaie.be/'
		}
	};

	/**
	 * Copy all the medias that are in the /media/others/ directory
	 */

	#copyOthers ( ) {
		const srcDir = theConfig.srcDir + 'medias/others/';
		const destDir = theConfig.destDir + 'medias/others/';
		if ( ! fs.existsSync ( srcDir ) ) {
			return;
		}
		fs.mkdirSync ( destDir, { recursive : true } );
		fs.cpSync ( srcDir, destDir, { recursive : true } );
	}

	/**
	 * Copy all the photos that are in the /medias/photos/pages/, removing exif data adding the new exif data
	 * and transform the jpg into WebP
	 */

	async #copyPagesPhotos ( ) {
		const srcDir = theConfig.srcDir + 'medias/photos/pages/';
		if ( ! fs.existsSync ( srcDir ) ) {
			return;
		}
		const destDir = theConfig.destDir + '/medias/photos/pages/';
		fs.mkdirSync ( destDir, { recursive : true } );
		const fileNames = fs.readdirSync ( srcDir );
		for ( let filesCounter = 0; filesCounter < fileNames.length; filesCounter ++ ) {
			const fileName = fileNames [ filesCounter ];
			const lstat = fs.lstatSync ( srcDir + fileName );
			if ( lstat.isFile ( ) && 'jpg' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
				await sharp ( srcDir + fileName )
					.keepIccProfile ( )
					.withExif ( this.#newExifData )
					.toFile ( destDir + fileName.split ( '.' ) [ 0 ] + '.WebP' );
			}
		}
	}

	/**
	 * Copy the post's photos to the correct directory, remove the exif data, add a copyright and an artist in the exif data,
	 * transform jpg to Webp and create a reducted photo
	 */

	async #copyPostsPhotos ( ) {
		const destDir = theConfig.destDir + '/medias/photos/posts/';
		fs.mkdirSync ( destDir, { recursive : true } );
		for ( let postCounter = 0; postCounter < theBlog.blogPosts.length; postCounter ++ ) {
			let post = theBlog.blogPosts [ postCounter ];
			await sharp ( post.photoSrcFileName )
				.keepIccProfile ( )
				.withExif ( this.#newExifData )
				.toFile ( destDir + post.photoIsoDate.replaceAll ( /:/g, '' ) + '.WebP' );
			await sharp ( post.photoSrcFileName )
				.keepIccProfile ( )
				.withExif ( this.#newExifData )
				// eslint-disable-next-line no-magic-numbers
				.resize ( { height : 162 } )
				.toFile ( ( destDir + post.photoIsoDate.replaceAll ( /:/g, '' ) + '_s.WebP' ) );
		}
	}

	/**
	 * Build the medias
	 */

	async build ( ) {
		await this.#copyPostsPhotos ( );
		await this.#copyPagesPhotos ( );
		this.#copyOthers ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default BlogMediasBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */