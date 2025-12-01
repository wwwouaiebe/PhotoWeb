/*
Copyright - 2021 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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

/* eslint-disable no-magic-numbers */

/**
A simple constant...
@type {Number}
*/

const N_3M5 = 3 * 5;

/**
A simple constant...
@type {Number}
*/

const N_8EXP2 = 8 ** 2;

/**
A simple constant...
@type {Number}
*/

const ONE = 1;

/**
A simple constant...
@type {Number}
*/

const ZERO = 0;

/* eslint-enable no-magic-numbers */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Mail buttons event handlers
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class MailOpener {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	FR Mail button event handler
	*/

	onMailContinueButtonFRClick ( ) {

		// Vous ne comprenez rien? Normal, c'est fait pour...
		if (
			// eslint-disable-next-line no-self-compare, space-infix-ops
			( '&&'&&'&&' === '&&' )
			&&
			N_8EXP2 + N_3M5 === Number.parseInt ( document.getElementById ( 'cyNumberFR' ).value )
		) {
			let addr = document.querySelector ( '#cyMailContinueButtonFR' ).getAttribute ( 'name' ) +
			String.fromCharCode (
				Number.parseInt ( document.getElementById ( 'cyNumberFR' ).value ) - N_3M5
			) +
			window.location.hostname.split ( '.' ).reverse ( ) [ ONE ] +
				'.' +
				window.location.hostname.split ( '.' ).reverse ( ) [ ZERO ];
			{
				let mailLink = document.createElement ( 'a' );
				mailLink.href = 'mailto:' + addr + '?subject=Message depuis ' + window.location.hostname;
				mailLink.click ( );
			}
			if ( navigator.clipboard ) {
				navigator.clipboard.writeText ( addr )
					.then (
						( ) => {
							document.getElementById ( 'cyClipboardFR' ).innerHTML =
								'L\'adresse mail a également été passée dans le presse-papier de votre ordinateur.';
						}
					)
					.catch ( ( ) => console.error ( 'failed to copy to the clipboard' ) );
			}
			document.getElementById ( 'cyMailFR' ).innerHTML =
				'Bravo! Vous êtes doué. Patientez un instant, votre mail va s\'ouvrir... ' +
				'si tout est bien configuré sur votre appareil.';
		}
		else {
			document.getElementById ( 'cyMailFR' ).innerHTML = 'Oufti biesse. Null en math.';
		}
		document.getElementById ( 'cyMailContinueButtonFR' ).style.visibility = 'hidden';
		document.getElementById ( 'cyMailContinueButtonEN' ).style.visibility = 'hidden';
	}

	/**
	EN Mail button event handler
	*/

	onMailContinueButtonENClick ( ) {

		// You do not understand anything? Normal, it's made for...
		if (
			// eslint-disable-next-line no-self-compare, space-infix-ops
			( '&&'&&'&&' === '&&' )
			&&
			N_8EXP2 + N_3M5 === Number.parseInt ( document.getElementById ( 'cyNumberEN' ).value )
		) {
			let addr = document.querySelector ( '#cyMailContinueButtonEN' ).getAttribute ( 'name' ) +
				String.fromCharCode (
					Number.parseInt ( document.getElementById ( 'cyNumberEN' ).value ) - N_3M5
				) +
				window.location.hostname.split ( '.' ).reverse ( ) [ ONE ] +
				'.' +
				window.location.hostname.split ( '.' ).reverse ( ) [ ZERO ];
			{
				let mailLink = document.createElement ( 'a' );
				mailLink.href = 'mailto:' + addr + '?subject=Message from ' + window.location.hostname;
				mailLink.click ( );
			}
			if ( navigator.clipboard ) {
				navigator.clipboard.writeText ( addr )
					.then (
						( ) => {
							document.getElementById ( 'cyClipboardEN' ).innerHTML =
								'The email address has also been passed to your computer\'s clipboard.';
						}
					)
					.catch ( ( ) => console.error ( 'failed to copy to the clipboard' ) );
			}
			document.getElementById ( 'cyMailEN' ).innerHTML =
				'Excellent! You are very good. Wait a moment, your email will open...' +
				' if everything is configured correctly on your device.';
		}
		else {
			document.getElementById ( 'cyMailEN' ).innerHTML = 'You are stupid.';
		}
		document.getElementById ( 'cyMailContinueButtonFR' ).style.visibility = 'hidden';
		document.getElementById ( 'cyMailContinueButtonEN' ).style.visibility = 'hidden';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of MailOpener  class
@type {MailOpener }
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMailOpener = new MailOpener ( );

// loading event handler for mail FR if needed

/**
The FR mail button
@type {HTMLElement}
*/

const mailContinueButtonFR = document.querySelector ( '#cyMailContinueButtonFR' );

if ( mailContinueButtonFR ) {
	mailContinueButtonFR.addEventListener (
		'click',
		( ) => theMailOpener.onMailContinueButtonFRClick ( )
	);
}

// loading event handler for mail EN if needed
/**
The EN mail button
@type {HTMLElement}
*/

let mailContinueButtonEN = document.querySelector ( '#cyMailContinueButtonEN' );

if ( mailContinueButtonEN ) {
	mailContinueButtonEN.addEventListener (
		'click',
		( ) => theMailOpener.onMailContinueButtonENClick ( )
	);
}

export default theMailOpener;

/* --- End of file --------------------------------------------------------------------------------------------------------- */