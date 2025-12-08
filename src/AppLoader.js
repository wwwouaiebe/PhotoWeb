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
import BlogFilesBuilder from './BlogFilesBuilder.js';
import fs from 'fs';

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
	 * The start time of the process
	 * @type {Number}
	 */

	#startTime;

	/**
	Complete theConfig object from the app parameters
	*/

	#createConfig ( ) {

		process.exitCode = 0;
		process.argv.forEach (
			arg => {
				const argContent = arg.split ( '=' );
				switch ( argContent [ 0 ] ) {
				case '--site' :
					if ( -1 === [ 'anthisnes.org', 'ouaie.be' ].indexOf ( argContent [ 1 ] ) ) {
						console.error (
							`\n\t\x1b[36msite ${argContent [ 1 ]} must be anthisnes.org or ouaie.be\x1b[0m\n`
						);
						process.exitCode = 1;
					}
					theConfig.site = argContent [ 1 ];
					break;
				case '--debug' :
					if ( ' true' === argContent [ 1 ] ) {
						theConfig.debug = true;
					}
					break;
				case '--version' :
					console.error ( `\n\t\x1b[36mVersion : ${AppLoader.#version}\x1b[0m\n` );
					process.exitCode = 1;
					break;
				default :
					break;
				}
			}
		);

		Object.freeze ( theConfig );

		if ( ! DirManager.validateDir ( theConfig.srcDir ) ) {
			console.error ( 'Invalid path for the --src parameter \x1b[31m%s\x1b[0m', theConfig.srcDir );
			process.exitCode = 1;
		}
		if ( ! DirManager.validateDir ( theConfig.destDir ) ) {
			console.error ( 'Invalid path for the --dest parameter \x1b[31m%s\x1b[0m', theConfig.destDir );
			process.exitCode = 1;
		}
	}

	/**
	 * Start the app
	 */

	async #start ( ) {

		// start time
		this.#startTime = process.hrtime.bigint ( );
		console.info ( `\nStarting PhotoWeb ${AppLoader.#version}...\n` );
	}

	/**
	 * Ends the app
	 */

	#end ( ) {

		// end of the process
		const deltaTime = process.hrtime.bigint ( ) - this.#startTime;

		/* eslint-disable-next-line no-magic-numbers */
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String ( deltaTime % 1000000000n ).substring ( 0, 3 );
		switch ( process.exitCode ) {
		case 0 :
			console.error ( `\nFiles generated in ${execTime} seconds in the folder \x1b[36m${theConfig.destDir}\n\n\x1b[0m` );
			break;
		default :
			console.error ( '\n\x1b[31mProcess stopped due to errors\x1b[0m' );
			try {
				fs.rmSync (	theConfig.destDir, { recursive : true, force : true } );
				fs.mkdirSync ( theConfig.destDir );
				console.error ( '\n\x1b[36mDestination directory cleaned!!\x1b[0m' );
			}
			catch ( err ) {
				console.error ( err );
				console.error ( '\n\x1b[31mDestination directory not cleaned!!\x1b[0m' );
			}

			break;
		}
	}

	/**
	Load the app, searching all the needed infos to run the app correctly
	*/

	async loadApp ( ) {

		this.#start ( );

		this.#createConfig ( );
		if ( 1 === process.exitCode ) {
			this.#end ( );
			return;
		}

		await new BlogFilesBuilder ( ).build ( );

		this.#end ( 1 );
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