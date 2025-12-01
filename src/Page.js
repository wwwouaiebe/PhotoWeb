class Page {

	#pageName;

	#pageContent;

	get pageName ( ) { return this.#pageName; }

	get pageContent ( ) { return this.#pageContent; }

	constructor ( pageName, pageContent ) {
		Object.freeze ( this );
		this.#pageName = pageName;
		this.#pageContent = pageContent;
	}
}

export default Page;