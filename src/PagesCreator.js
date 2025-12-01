import Page from './Page.js';
import theConfig from './Config.js';
import fs from 'fs';

class PagesCreator {

	async #findFiles ( ) {
	}

	async extract ( ) {
		const pages = [];
   		await this.#findFiles ( theConfig.pagesDir );
		const fileNames = fs.readdirSync ( theConfig.pagesDir );
		for ( let filesCounter = 0; filesCounter < fileNames.length; filesCounter ++ ) {
			const fileName = fileNames [ filesCounter ];
			const lstat = fs.lstatSync ( theConfig.pagesDir + fileName );
			if ( lstat.isFile ( ) && 'html' === fileName.split ( '.' ).reverse ( )[ 0 ] ) {
				pages.push (
					new Page (
					    fileName.slice ( 0, fileName.length - 5 ),
					    fs.readFileSync ( theConfig.pagesDir + fileName, { encoding : 'utf8' } )
				    )
				);
 			}
		}
		return pages;
	}

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default PagesCreator;