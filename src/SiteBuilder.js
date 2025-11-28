import theConfig from "./Config.js";
import DirManager from "./DirManager.js";

class SiteBuilder {

	/**
	A const to use when exit the app due to a bad parameter
	@type {Number}
	*/

    Build ( ) {

        if ( ! DirManager.removeDir ( theConfig.destDir ) ) {
			console.error ( `\x1b[31mNot possible to clean the $dir folder\x1b[0m` );
            process.exitCode = 1;
            return;
        }

        process.exitCode = 0;
        return;
    }

    constructor ( ) {

    }
}