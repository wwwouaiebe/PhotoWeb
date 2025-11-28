import fs from 'fs';
class DirManager {

    	/**
	Validate a path:
	- Verify that the path exists on the computer
	- verify that the path is a directory
	- complete the path with a \
	@param {String} path The path to validate
	*/

    static validateDir ( dir ) {
		let returnDir = dir;
		if ( '' === returnDir ) {
            return null;
		}

		let pathSeparator = null;
		try {
			returnDir = fs.realpathSync ( returnDir );

			// path.sep seems not working...
			pathSeparator = -1 === returnDir.indexOf ( '\\' ) ? '/' : '\\';

			const lstat = fs.lstatSync ( returnDir );
			if ( lstat.isFile ( ) ) {
				return null;
			}

		    returnDir += pathSeparator;
		    return returnDir;
		}
		catch (err) {
            return null;
		}
	}

    static removeDir ( dir ) {
		try {

			// Removing the complete directory
			fs.rmSync (
				dir,
				{ recursive : true, force : true },
				err => {
					if ( err ) {
						throw err;
					}
				}
			);

			// and then recreating
			fs.mkdirSync ( dir );

            return true;
		}
		catch {

			// Sometime the cleaning fails due to opened files
            return false;
		}
    }
}

export default DirManager