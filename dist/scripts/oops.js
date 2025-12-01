const docURL = new URL ( window.location );
const ref = docURL.searchParams.get ( 'REF' ) || '';
const uri = docURL.searchParams.get ( 'URI' ) || '';
docURL.searchParams.set ( 'URI', 'oops' );
docURL.searchParams.set ( 'REF', 'oops' );
document.getElementById ( 'URI' ).href = '/main/1/' + uri;