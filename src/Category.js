class Category {

	#name;

	#parent = null;

	#childrens = [];

	get name ( ) { return this.#name; }

	get parent ( ) { return this.#parent; }

	get childrens ( ) { return this.#childrens; }

	constructor ( parentName, childrenName ) {
		this.#name = ( childrenName ? childrenName : parentName );
		if ( childrenName ) {
			this.#parent = parentName;
		}
		Object.freeze ( this );
	}
}

export default Category;