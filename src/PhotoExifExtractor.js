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

import sharp from 'sharp';
import exif from 'exif-reader';
import fs from 'fs';
import theConfig from './Config.js';
import Post from './Post.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class search all the needed data in the exif info of the photos and creates an array of Post objects with the results
 */
/* ------------------------------------------------------------------------------------------------------------------------- */


class PhotoExifExctractor {

    /**
     * An array with the posts
     * @type {Array.<Post>}
     */

    #posts = [];

    /**
     * The exif metadata of the currently analysed photo
     * @type {Object}
     */

    #exifMetaData = null;

    /**
     * An array with the path of photos without exif data and without a correct name
     * @type {Array.<String>}
     */

    #noExifPhotos = [];

    /**
     * An array with the path of photos without height and width
     * @type {Array.<String>}
     */

    #noWidthHeightPhotos = [];

    /**
     * The file name of the currently analysed photo, included the path and extension
     * @type {String}
     */

    #photoFileName = '';

    /**
     * The technical info of the currently analysed photo
     * @type {String}
     */

    #photoTechInfo = '';

   /**
     * The width of the currently analysed photo
     * @type {Number}
     */

   #photoWidth = 0;

   /**
     * The height of the currently analysed photo
     * @type {Number}
     */

   #photoHeight = 0;

   /**
     * The class name of the currently analysed photo
     * @type {String}
     */

   #photoHtmlClassName = 0;

   /**
     * The date as iso string of the currently analysed photo
     * @type {String}
     */

   #photoIsoDate ='';

   /**
     * The categories of the currently analysed photo
     * @type {Array.<String>}
     */

   #categories = [];

   /**
    * Transform the exposure time in the exif data to the standard exposure time used by photographs
    * @param {Number} exposureTime  the exif exposure time
    * @returns {String} the readable exposure time
    */

    #formatExposureTime ( exposureTime ) {
        const strExposureTime = String ( exposureTime ).split ( '.' );
        return '0' === strExposureTime [ 0 ] ?  '1/' + ( 1 / exposureTime).toFixed ( 0 ) : strExposureTime [ 0] ; 
    }

    /**
     * Extract the technical infos from the photo exif data
     */

    #extractTechInfos ( ) {
        const model = this.#exifMetaData?.Image?.Model;
        const exposureTime = this.#exifMetaData?.Photo?.ExposureTime;
        const fNumber = this.#exifMetaData?.Photo?.FNumber;
        const isoSpeedRatings = this.#exifMetaData?.Photo?.ISOSpeedRatings;
        const focalLength = this.#exifMetaData?.Photo?.FocalLength;
        this.#photoTechInfo = '';
        if ( model && exposureTime && fNumber && isoSpeedRatings &&focalLength   ) {
                this.#photoTechInfo =  model + ' ' +
                focalLength + ' mm - f' +
                fNumber + ' ' +
                this.#formatExposureTime ( exposureTime ) + ' sec. ' +
                isoSpeedRatings + ' ISO';
        }
    }

    /**
     * Extract the date from the photo exif data or from the file name
     */

    #exctractDate ( ){

        this.#photoIsoDate = null;
        // Date is searched in the photo exif data
         let dateTime = this.#exifMetaData.Photo.DateTimeOriginal;

        if ( !dateTime ) {
            // noDate found... searching in the image exif data
            dateTime = this.#exifMetaData.Image.DateTime;
        }

        if ( dateTime) {
            this.#photoIsoDate = dateTime.toISOString ( ).split ( '.' ) [ 0 ];
        }
        else {
            // no date found in the exif... Searching if the photo file name can be converted to an iso date
            // Searching file name
            let strDateTime = this.#photoFileName.split ( '/' ).reverse ( ) [ 0 ].split ( '.' ) [ 0 ];

            // Adding : to the file name ( reminder : is not a valid char in files names ) 
            strDateTime = strDateTime.slice ( 0, 13) + ':' + strDateTime.slice ( 13, 15) + ':' + strDateTime.slice ( 15 );

            // verify that the file name is a valid iso date
            if ( isNaN ( Date.parse ( strDateTime ) ) ) {
                this.#noExifPhotos.push ( this.#photoFileName );
            }
            else {
                this.#photoIsoDate = strDateTime;
            }
        }
   }

      /**
     * Extract the dimensions from the photo exif data
     */

    #exctractPhotoDimensions ( ) {
        this.#photoWidth = this.#exifMetaData?.Photo?.PixelXDimension || 0;
        this.#photoHeight = this.#exifMetaData?.Photo?.PixelYDimension || 0;
        if ( 0 === this.#photoWidth || 0 === this.#photoHeight ) {
            this.#noWidthHeightPhotos.push ( this.#photoFileName );
        }
        if ( this.#photoWidth > this.#photoHeight ) {
            this.#photoHtmlClassName = 'Landscape';
        }
        else if ( this.#photoWidth < this.#photoHeight ) {
            this.#photoHtmlClassName = 'Portrait';
        }
        else {
            this.#photoHtmlClassName = 'Square';
        }
    }

    /**
     * Build a post from the extracted data and add it to the posts collection
     */

    #addPost ( ) {
        const post = new Post ( );
        post.photoFileName = this.#photoFileName;
        post.photoWidth = this.#photoWidth;
        post.photoHeight = this.#photoHeight;
        post.photoHtmlClassName = this.#photoHtmlClassName;
        post.photoTechInfo = this.#photoTechInfo;
        post.photoIsoDate = this.#photoIsoDate;
        post.categories = this.#categories;
        Object.freeze ( post );
        this.#posts.push ( post );
    }

    /**
     * Find all the files in a directory and it's subdirectory
     * For each file, exctracts the exif data and creates a post
     * Eventually rename the file with the date found in the exif data
     * @param {} srcDir 
     */

    async #findFiles ( srcDir ) {
        const fileNames = fs.readdirSync ( srcDir );
        for ( let filesCounter = 0; filesCounter < fileNames.length; filesCounter ++ ) {
            const fileName = fileNames [ filesCounter ];
            const lstat = fs.lstatSync (srcDir + fileName );
            if ( lstat.isDirectory ( ) ) {
                this.#categories.push ( fileName );

                // Warning recursive loop...
                await this.#findFiles (  srcDir + fileName + '/');
                this.#categories.pop ( );
            }
            else if ( lstat.isFile ( ) &&  'jpg' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {

                //Data extraction
                this.#photoFileName = srcDir +  fileNames [ filesCounter ];
                const metaData = await sharp ( this.#photoFileName ).metadata ( );
                this.#exifMetaData = exif ( metaData.exif );
                this.#exctractDate ( );
                this.#extractTechInfos ( );
                this.#exctractPhotoDimensions ( ); 

                // Renaming the file if needed
                if ( 
                        this.#photoIsoDate 
                        &&
                        ( this.#photoIsoDate.replaceAll ( ':', '') + '.jpg' )  !== fileName 
                ){
                    this.#photoFileName = srcDir + this.#photoIsoDate.replaceAll ( ':', '') + '.jpg';
                    fs.renameSync ( srcDir + fileName, this.#photoFileName );
                } 

                // Adding the post
                this.#addPost ( );
             }
        }
    }

    /**
     * Strat the data extraction
     * @returns {Array.<Post> | boolean} An array with the posts or false if errors found
     */

    async exctract ( ) {

        await this.#findFiles ( theConfig.postsDir );

        // exit if no errors
        if ( 0 === this.#noExifPhotos.length && 0 === this.#noWidthHeightPhotos.length )
        {
            return this.#posts;
        }

        // display errors
        if ( 0 !== this.#noExifPhotos.length ) {
            console.info ( '\n\n\x1b[31mPhotos without exif data and bad file name: \x1b[0m');
            this.#noExifPhotos.forEach (
                noExifPhoto => console.info ( '\t\x1b[31m' + noExifPhoto + '\x1b[0m')
            );
        }
        if ( 0 !== this.#noWidthHeightPhotos.length ) {
           console.info ( '\n\n\x1b[31mPhotos without width and/or height: \x1b[0m');
            this.#noWidthHeightPhotos.forEach (
                noWidthHeightPhoto => console.info ( '\t\x1b[31m' + noWidthHeightPhoto + '\x1b[31m')
            );
        }

        return false;
    }

    /**
     * The constructor
     */

    constructor ( ) {
        Object.freeze ( this );
    }
}

export default PhotoExifExctractor;

/* --- End of file --------------------------------------------------------------------------------------------------------- */