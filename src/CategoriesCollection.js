import Category from './Category.js';

class CategoriesCollection {

	#categories = new Map ( );

	getCategory ( categoryName ) {
		return this.#categories.get ( categoryName );
	}

	getCategories ( ) {
		return this.#categories;
	}

	getParentCategories ( ) {
		const parentCategories = [];
		this.#categories.forEach (
			category => {
				if ( ! category.parent ) {
					parentCategories.push ( category );
				}
			}
		);
		parentCategories.sort (
			( first, second ) => {
				if ( first.name > second.name ) {
					return 1;
				}
				if ( first.name < second.name ) {
					return -1;
				}
				if ( first.name === second.name ) {
					return 0;
				}
			}
		);
		return parentCategories;
	}

	#setCategory ( parentName, childrenName ) {
		let parentCategory = this.#categories.get ( parentName );
		if ( ! parentCategory ) {
			parentCategory = new Category ( parentName );
			this.#categories.set ( parentCategory.name, parentCategory );
		}

		if ( childrenName ) {
			let childrenCategory = this.#categories.get ( childrenName );
			if ( ! childrenCategory ) {
				childrenCategory = new Category ( parentName, childrenName );
				this.#categories.set ( childrenCategory.name, childrenCategory );
			}
			if ( -1 === parentCategory.childrens.indexOf ( childrenCategory.name ) ) {
			    parentCategory.childrens.push ( childrenCategory.name );
			}
		}
 	}

	constructor ( blogPosts ) {

		blogPosts.forEach (
			post => { this.#setCategory ( post.categories[ 0 ], post.categories [ 1 ] ); }
		);
		this.#categories.forEach (
			category => {
				category.childrens.sort (
					( first, second ) => {
						if ( first.toLowerCase ( ) > second.toLowerCase ( ) ) {
							return 1;
						}
						else if ( first.toLowerCase ( ) < second.toLowerCase ( ) ) {
							return -1;
						}
						else if ( first.toLowerCase ( ) === second.toLowerCase ( ) ) {
							return 0;
						}
					}
				);
			}
		);

		Object.freeze ( this );
	}
}

export default CategoriesCollection;