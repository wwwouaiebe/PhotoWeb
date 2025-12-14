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

import crypto from 'crypto';
import { rollup } from 'rollup';
import { minify } from 'terser';
import fs from 'fs';
import theConfig from './Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A class for building the js scripts files
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class JSSriptsFilesBuilder {

	/**
     * The name of the file to process (without any directory, without any extension)
	 * @type {String}
     */

	#fileName;

	/**
	 * A temporary dir for communication between rollup and terser..
	 * Todo Find a better way...
	 * @type {String}
	 */

	#tmpDir = './tmp/';

	/**
	 * The source file
	 * @type {String}
	 */

	#srcFile;

	/**
	 * the final destination for the scripts
	 * @type {String}
	 */

	#destScriptsDir;

	/**
	 * The hash value of the processed file
	 * @type {String}
	 */

	#hash;

	/**
	 * Compute the sha384 hash
	 */

	#computeHash ( ) {
		let content = fs.readFileSync ( this.#destScriptsDir + this.#fileName + '.min.js' );
		let hash = crypto.createHash ( 'sha384' )
			.update ( content, 'utf8' )
			.digest ( 'base64' );

		this.#hash = hash;
	}

	/**
	 * Run Rollup
	 */

	async #runRollup ( ) {
		const bundle = await rollup ( { input : this.#srcFile } );
		await bundle.write (
			{
				file : this.#tmpDir + this.#fileName + '.js',
				format : 'iife'
			}
		);
	}

	/**
	 * Run terser
	 */

	async #runTerser ( ) {
		let result = await minify (
			fs.readFileSync ( this.#tmpDir + this.#fileName + '.js', 'utf8' ),
			{
				mangle : true,
				compress : true,
				// eslint-disable-next-line no-magic-numbers
				ecma : 2025
			}
		);

		fs.writeFileSync (
			this.#destScriptsDir + this.#fileName + '.min.js',
			result.code,
			'utf8'
		);
	}

	/**
	 * Clean the temp directory
	 */

	#cleanTmp ( ) {
		fs.rmSync ( this.#tmpDir, { recursive : true, force : true } );
	}

	/**
	 * Build the script files in release mode. Files are processed with rollup and terser
	 * @returns {String} A string with the data needed to load and run the script that can be placed
	 * in a <script> tag
	 */

	async #buildRelease ( ) {

		// exit if a bad script name is passed
		if ( ! fs.existsSync ( this.#srcFile ) ) {
			console.error ( '\n\x1b[31mThe file ' + this.#srcFile + ' was not found\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		// cleaning and rebuild the tmp directiry
		this.#cleanTmp ( );
		fs.mkdirSync ( this.#tmpDir );

		// running rollup and terser
		await this.#runRollup ( );
		await this.#runTerser ( );

		// cleaning tmp again
		this.#cleanTmp ( );

		// computing hash
		this.#computeHash ( );

		// return
		return 'src="/scripts/' + this.#fileName + '.min.js" integrity="sha384-' + this.#hash + '" crossorigin="anonymous"';
	}

	/**
	 * Build the script files in debug mode. Files are not processed with rollup and terser
	 * and can be used as module
	 * @returns {String} A string with the data needed to load and run the script that can be placed
	 * in a <script> tag
	 */

	async #buildDebug ( ) {

		fs.cpSync ( './srcScripts/', this.#destScriptsDir, { recursive : true } );

		// return
		return 'src="/scripts/' + this.#fileName + '.js" type="module"';
	}

	/**
	 * Build the scripts files
	 * @param {String} srcFile the source file to build
	 * @returns {String} A string with the data needed to load and run the script that can be placed
	 * in a <script> tag
	 */

	build ( srcFile ) {

		// init vars
		this.#srcFile = srcFile;
		this.#fileName = this.#srcFile.split ( '/' ).reverse () [ 0 ].split ( '.' ) [ 0 ];
		this.#destScriptsDir = theConfig.destDir + '/scripts/';

		// creating the destination directory
		fs.mkdirSync ( this.#destScriptsDir, { recursive : true } );

		// Building files
		if ( theConfig.debug ) {
			return this.#buildDebug ( );
		}
		return this.#buildRelease ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default JSSriptsFilesBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */