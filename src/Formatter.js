class Formater {

	static toAscii ( str ) {
		return str.normalize ( 'NFD' ).replaceAll ( /[\u0300-\u036F]/g, '' );
	}

	static toUrlString ( str ) {
		const returnValue = Formater.toAscii ( str )
			.replaceAll ( /Æ|æ/g, 'ae' )
			.replaceAll ( /Œ|œ/g, 'oe' )
			.replaceAll ( /ø|Ø/g, 'o' )
			.replaceAll ( / |'/g, '-' )
			.toLowerCase ( )
			.replaceAll ( /[^a-z|^0-9|^-]/g, '' );

		return returnValue;
	}

	static formatDate ( isoDate ) {
		const tmpDate = new Date ( isoDate );
		const days = [ 'dimanche ', 'lundi ', 'mardi ', 'mercredi ', 'jeudi ', 'vendredi ', 'samedi ' ];
		const months = [
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
			'décembre '
		];
		return days [ tmpDate.getDay ( ) ] + tmpDate.getDate ( ) + months [ tmpDate. getMonth ( ) ] + tmpDate.getFullYear ( );
	}

	static formatDateTime ( isoDate ) {
		// eslint-disable-next-line no-unused-vars
		const [ hours, minutes, seconds ] = isoDate.split ( 'T' ) [ 1 ].split ( ':' ).map ( value => Number ( value ) );
		return Formater.formatDate ( isoDate ) + ' ' +
            hours + ( 1 < hours ? ' heures ' : ' heure ' ) + minutes;
	}

	constructor ( ) {

	}
}

export default Formater;