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

import theConfig from "./Config.js";
import fs from 'fs';
import PhotoExifExctractor from './PhotoExifExtractor.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A class that stores the configuration of the app
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

   	/**
	The version number
	@type {String}
	*/

	static get #version ( ) { return 'v1.0.0-dev'; }

	/**
	A const to use when exit the app due to a bad parameter
	@type {Number}
	*/

	static get #EXIT_BAD_PARAMETER ( ) { return 9; }

	/**
	Complete theConfig object from the app parameters
	*/

    #createConfig ( ) {
        process.argv.forEach (
            arg => {
                const argContent = arg.split ( '=' );
                switch ( argContent [ 0 ] ) {
                case '--site' :
                    if ( -1 === [ 'anthisnes.org', 'ouaie.be' ].indexOf ( argContent [ 1 ] ) ) {
                        console.error (
                            `\n\t\x1b[36msite ${argContent [ 1 ]} must be anthisnes.org or ouaie.be\x1b[0m\n`
                        );
                        process.exit ( 1 );
                    }
                    theConfig.site = argContent [ 1 ];
                    break;
                case '--version' :
                    console.error ( `\n\t\x1b[36mVersion : ${AppLoader.#version}\x1b[0m\n` );
                    process.exit ( 0 );
                    break;
                default :
                    break;
                }
            }
        );

        Object.freeze ( theConfig );

    }

	/**
	Validate a path:
	- Verify that the path exists on the computer
	- verify that the path is a directory
	- complete the path with a \
	@param {String} path The path to validate
	*/

    #validatePath ( path ) {
		let returnPath = path;
		let pathSeparator = null;
		try {
			returnPath = fs.realpathSync ( path );
		}
		catch (err) {
			console.error ( 'Invalid path for the --src or --dest parameter \x1b[31m%s\x1b[0m', returnPath );
			process.exit ( AppLoader.#EXIT_BAD_PARAMETER );
		}
		returnPath += pathSeparator;
		return returnPath;
	}

	/**
	Load the app, searching all the needed infos to run the app correctly
	*/

    async loadApp ( ) {
        this.#createConfig ( );
        this.#validatePath ( theConfig.srcDir );
        this.#validatePath ( theConfig.destDir );

		// start time
		const startTime = process.hrtime.bigint ( );

		// console.clear ( );
		console.info ( `\nStarting PhotoWeb ${AppLoader.#version}...` );

		// end of the process
		const deltaTime = process.hrtime.bigint ( ) - startTime;

        const photoExifExtractor = new PhotoExifExctractor ( );
        const posts = await photoExifExtractor.exctract ( ) ;
        if ( ! posts ) {
            process.exit ( 9 );
        }

        /* eslint-disable-next-line no-magic-numbers */
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String ( deltaTime % 1000000000n ).substring ( 0, 3 );
		console.error ( `\nFiles generated in ${execTime} seconds in the folder \x1b[36m${theConfig.destDir}\x1b[0m` );
    }

    /**
     * The constructor
     */

    constructor ( ) {
        Object.freeze ( this );
    }
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */