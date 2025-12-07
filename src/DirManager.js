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

import fs from 'fs';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A static class wiyh methods for directory validation and removing
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class DirManager {

    	/**
	Validate a dir:
	- Verify that the dir exists on the computer
	- verify that the dir is a directory
	- complete the dir with a \
	@param {String} dir The path to validate
	@returns {String|null} the validated dir or null if the dir is invalid
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
		catch {
			return null;
		}
	}

	/**
	 * Remove completely the contains of a directory
	 * @param {String} dir the directory name to clean
	 * @returns {boolean} true when success
	 */

	static cleanDir ( dir ) {
		try {

			// Removing the complete directory
			fs.rmSync (
				dir,
				{ recursive : true, force : true }
			);

			// and then recreating
			fs.mkdirSync ( dir );

			return true;
		}
		catch ( err ) {
			console.error ( err );
			return false;
		}
	}
}

export default DirManager;

/* --- End of file --------------------------------------------------------------------------------------------------------- */