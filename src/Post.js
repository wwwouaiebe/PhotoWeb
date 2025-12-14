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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A simple container to store the data of a post
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Post {

	/**
     * The photo file name with the path and the extension
     * @type {String}
     */

	photoSrcFileName;

	/**
      * get the full name of the photo file, included the path
      * @type {String}
      */

	get mediaPhotoFileName ( ) {
		return '/medias/photos/posts/' + this.photoSrcFileName.split ( '/' ).reverse ( ) [ 0 ].split ( '.' ) [ 0 ] + '.WebP';
	}

	/**
     * The width of the photo
     * @type {Number}
     */

	photoWidth;

	/**
     * The height of the photo
     * @type {Number}
     */

	photoHeight;

	/**
     * The html class name of the photo. Mist be 'Landscape', 'Square' or 'Portrait'
     * @type {Number}
     */

	photoHtmlClassName;

	/**
     * The technical infos of the photo
     * @type {String}
     */

	photoTechInfo;

	/**
     * The categories of the photo
     * @type {Array.<String>}
     */

	categories = [];

     /**
      * The hashtags of the photo
      * @type {Array.<String>}
      */

	hashTags = [];

	/**
     * The date of the photo in the ISO format
     * @type {String}
     */

	photoIsoDate;

	/**
     * The constructor
     */

	constructor ( ) {
		Object.seal ( this );
	}
}

export default Post;

/* --- End of file --------------------------------------------------------------------------------------------------------- */