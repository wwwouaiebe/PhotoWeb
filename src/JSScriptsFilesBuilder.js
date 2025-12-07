import crypto from 'crypto';
import { rollup } from 'rollup';
import { minify } from 'terser';
import fs from 'fs';
import theConfig from './Config.js';

class JSSriptsFilesBuilder {

	/**
     * The name of the file to process (without any directory, without any extension)
     */

	#fileName;

	#tmpDir = './tmp/';

	#srcFile;

	#destScriptsDir;

	#hash;

	#computeHash ( ) {
		let content = fs.readFileSync ( 'dist/scripts/' + this.#fileName + '.min.js' );
		this.#hash = crypto.createHash ( 'sha384' )
			.update ( content, 'utf8' )
			.digest ( 'base64' );
	}

	async #runRollup ( ) {
		const bundle = await rollup ( { input : this.#srcFile } );
		await bundle.write (
			{
				file : this.#tmpDir + this.#fileName + '.js',
				format : 'iife'
			}
		);
	}

	async #runTerser ( ) {
		let result = await minify (
			fs.readFileSync ( this.#tmpDir + this.#fileName + '.js', 'utf8' ),
			{
				mangle : true,
				compress : false,
				ecma : 2025
			}
		);

		fs.writeFileSync (
			'dist/scripts/' + this.#fileName + '.min.js',
			result.code,
			'utf8'
		);
	}

	#cleanTmp ( ) {
		fs.rmSync ( this.#tmpDir, { recursive : true, force : true } );
	}

	async #buildRelease ( ) {

		if ( ! fs.existsSync ( this.#srcFile ) ) {
			console.error ( '\n\x1b[31mThe file ' + this.#srcFile + ' was not found\x1b[0m' );
			process.exitCode = 1;
			return;
		}

		this.#cleanTmp ( );
		fs.mkdirSync ( this.#tmpDir );

		await this.#runRollup ( );
		await this.#runTerser ( );

		this.#cleanTmp ( );
		this.#computeHash ( );

		return 'src="/scripts/index.min.js" integrity="sha384-' + this.#hash + '" crossorigin="anonymous"';
	}

	async #buildDebug ( ) {

		let fileNames = fs.readdirSync ( './srcScripts/' );
		fileNames.forEach (
			fileName => {
				fs.copyFileSync ( './srcScripts/' + fileName, this.#destScriptsDir + fileName );
			}
		);

		return 'src="/scripts/' + this.#fileName + '.js" type="module"';
	}

	build ( srcFile ) {

		this.#srcFile = srcFile;
		this.#fileName = this.#srcFile.split ( '/' ).reverse () [ 0 ].split ( '.' ) [ 0 ];
		this.#destScriptsDir = theConfig.destDir + '/scripts/';
		fs.mkdirSync ( this.#destScriptsDir, { recursive : true } );

		if ( theConfig.debug ) {
			return this.#buildDebug ( );
		}

		return this.#buildRelease ( );
	}

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default JSSriptsFilesBuilder;