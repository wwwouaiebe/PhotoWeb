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
 * A static class with methods to format strings
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Formater {

	/**
	 * An array with the month
	 * @type {Array.<String>}
	 */

	static #months = [
		' janvier ',
		' février ',
		' mars ',
		' avril ',
		' mai ',
		' juin  ',
		' juillet ',
		' août ',
		' septembre ',
		' octobre ',
		' novembre ',
		' décembre '
	];

	/**
	 * Remove the diacritics char in a string
	 * @param {String } str the string to transform
	 * @returns {string} the string without diacritics
	 */

	static removeDiacritics ( str ) {
		return str.normalize ( 'NFD' ).replaceAll ( /[\u0300-\u036F]/g, '' );
	}

	/**
	 * transform a string into another string that can be used for url.
	 * replace ligatures with ascii letters, spaces with -, ø|Ø with o, transforme to lower case and remove non ascii chars
	 * @param {String} str the string to transform
	 * @returns {String} a string that can be used to build url
	 */

	static toUrlString ( str ) {
		const returnValue = Formater.removeDiacritics ( str )
			.replaceAll ( /Æ|æ/g, 'ae' )
			.replaceAll ( /Œ|œ/g, 'oe' )
			.replaceAll ( /ø|Ø/g, 'o' )
			.replaceAll ( / |'/g, '-' )
			.toLowerCase ( )
			.replaceAll ( /[^a-z|^0-9|^-]/g, '' );

		return returnValue;
	}

	/**
	 * Transform an iso date string, so the string can be used for url
	 * @param {String} isoDate the iso date string to transform
	 * @returns {String} the transformed date
	 */

	static isoDateToUrlString ( isoDate ) {
		return isoDate.replaceAll ( /:/g, '' );
	}

	/**
	 * transform an iso date string in a human readable format with only the month and year of the iso date
	 * @param {String} isoDate the iso date string to transform
	 * @returns {String} the transformed date
	 */

	static isoDateToMonthYear ( isoDate ) {
		const tmpDate = new Date ( isoDate );
		return Formater.#months [ tmpDate. getMonth ( ) ] + tmpDate.getFullYear ( );
	}

	/**
	 * transform an iso date string in a human readable format with the weekday, the date, the month and year of the iso date
	 * @param {String} isoDate the iso date string to transform
	 * @returns {String} the transformed date
	 */

	static isoDateToHumanDate ( isoDate ) {
		const tmpDate = new Date ( isoDate );
		const days = [ 'dimanche ', 'lundi ', 'mardi ', 'mercredi ', 'jeudi ', 'vendredi ', 'samedi ' ];
		return days [ tmpDate.getDay ( ) ] + tmpDate.getDate ( ) +
			Formater.#months [ tmpDate. getMonth ( ) ] + tmpDate.getFullYear ( );
	}

	/**
	 * transform an iso date string in a human readable format with
	 * the weekday, the date, the month, the year hours and minutes of the iso date
	 * @param {String} isoDate the iso date string to transform
	 * @returns {String} the transformed date
	 */

	static isoDateToHumanDateTime ( isoDate ) {
		// eslint-disable-next-line no-unused-vars
		const [ hours, minutes, seconds ] = isoDate.split ( 'T' ) [ 1 ].split ( ':' ).map ( value => Number ( value ) );
		return Formater.isoDateToHumanDate ( isoDate ) + ' ' +
            hours + ( 1 < hours ? ' heures ' : ' heure ' ) + minutes;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {

	}
}

export default Formater;

/* --- End of file --------------------------------------------------------------------------------------------------------- */