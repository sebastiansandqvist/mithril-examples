import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var BookShop = {
	oninit: function(vnode) {

		// fetch array of book objects from server of form:
		// { name: 'The Iliad', price: 12 }
		vnode.state.books = m.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json'
		});

		vnode.state.cart = m.prop([]);
		vnode.state.text = m.prop('');

		// once books have loaded, filter by title and prevent
		// items in cart from showing up in the shop
		vnode.state.shop = m.prop.combine(function(text, books, cart) {
			return books().filter(function(book) {
				return book.name.toLowerCase()
					.indexOf(text().toLowerCase()) > -1 &&
						cart().indexOf(book) === -1;
			});
		}, [vnode.state.text, vnode.state.books, vnode.state.cart]);

		// when the cart updates, state.total = price of books in cart
		vnode.state.total = vnode.state.cart.map(function(cart) {
			return cart.reduce(function(prev, next) {
				prev + next.price;
			}, 0);
		});

	},
	view: function(vnode) {
		var shop = vnode.state.shop();
		return (
			m('div',
				m('h3', 'Book Shop'),
				m('input[type=text]', {
					placeholder: 'Filter',
					value: vnode.state.text(),
					oninput: m.withAttr('value', vnode.state.text)
				}),
				m('ul',
					 shop ? shop.map(function(book, i) {
						return m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick: function() {
									vnode.state.cart(
										vnode.state.cart().concat(book)
									);
								}
							}, 'Add')
						)
					}) : m('div', 'Loading...')
				),
				m('hr'),
				m('h3', 'Cart'),
				m('ul',
					state.cart().map(function(book, i) {
						return m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									state.cart(
										state.cart().filter(function(item) {
											return item !== book;
										})
									);
								}
							}, 'Remove')
						)
					})
				),
				m('strong', 'Total: '),
				m('span', '$', state.total())
			)
		);
	}
};`);

const es6 = codeString(
`const BookShop = {
	oninit({ state }) {

		// fetch array of book objects from server of form:
		// { name: 'The Iliad', price: 12 }
		state.books = m.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json'
		});

		state.cart = m.prop([]);
		state.text = m.prop('');

		// once books have loaded, filter by title and prevent
		// items in cart from showing up in the shop
		state.shop = m.prop.combine(function(text, books, cart) {
			return books().filter(function(book) {
				return book.name.toLowerCase()
					.indexOf(text().toLowerCase()) > -1 &&
						cart().indexOf(book) === -1;
			});
		}, [state.text, state.books, state.cart]);

		// when the cart updates, state.total = price of books in cart
		state.total = state.cart.map(function(cart) {
			return cart.reduce((prev, next) => prev + next.price, 0);
		});

	},
	view({ state }) {
		return (
			m('div',
				m('h3', 'Book Shop'),
				m('input[type=text]', {
					placeholder: 'Filter',
					value: state.text(),
					oninput: m.withAttr('value', state.text)
				}),
				m('ul',
					state.shop() ? state.shop().map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									state.cart(state.cart().concat(book));
								}
							}, 'Add')
						)
					) : m('div', 'Loading...')
				),
				m('hr'),
				m('h3', 'Cart'),
				m('ul',
					state.cart().map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									state.cart(
										state.cart().filter((item) => item !== book)
									);
								}
							}, 'Remove')
						)
					)
				),
				m('strong', 'Total: '),
				m('span', '$', state.total())
			)
		);
	}
};`);

const jsx = codeString(
`const BookShop = {
	oninit({ state }) {

		// fetch array of book objects from server of form:
		// { name: 'The Iliad', price: 12 }
		state.books = m.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json'
		});

		state.cart = m.prop([]);
		state.text = m.prop('');

		// once books have loaded, filter by title and prevent
		// items in cart from showing up in the shop
		state.shop = m.prop.combine(function(text, books, cart) {
			return books().filter(function(book) {
				return book.name.toLowerCase()
					.indexOf(text().toLowerCase()) > -1 &&
						cart().indexOf(book) === -1;
			});
		}, [state.text, state.books, state.cart]);

		// when the cart updates, state.total = price of books in cart
		state.total = state.cart.map(function(cart) {
			return cart.reduce((prev, next) => prev + next.price, 0);
		});

	},
	view({ state }) {
		return (
			<div>
				<h3>Book Shop</h3>
				<input
					type='text'
					placeholder='Filter'
					value={state.text()}
					oninput={m.withAttr('value', state.text)}/>
				<ul>
					{
						state.shop() ? state.shop().map((book, i) =>
							<li key={i}>
								<span>{book.name} $\{book.price}</span>
								<button
									className='right'
									onclick={() => state.cart(state.cart().concat(book))}>
									Add
								</button>
							</li>
						) : <div>Loading...</div>
					}
				</ul>
				<hr/>
				<h3>Cart</h3>
				<ul>
					{
						state.cart().map((book, i) =>
							<li key={i}>
								<span>{book.name} $\{book.price}</span>
								<button
									className='right'
									onclick={() => state.cart(
										state.cart().filter((item) => item !== book)
									)}>
									Remove
								</button>
							</li>
						)
					}
				</ul>
				<strong>Total: </strong>
				<span>$\{state.total()}</span>
			</div>
		);
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

export const Component = {
	oninit({ state }) {

		// fetch array of book objects from server of form:
		// { name: 'The Iliad', price: 12 }
		state.books = m.request({
			method: 'GET',
			url: 'https://mithril-examples.firebaseio.com/books.json'
		});

		state.cart = m.prop([]);
		state.text = m.prop('');

		// once books have loaded, filter by title and prevent
		// items in cart from showing up in the shop
		state.shop = m.prop.combine(function(text, books, cart) {
			return books().filter(function(book) {
				return book.name.toLowerCase().indexOf(text().toLowerCase()) > -1 &&
					cart().indexOf(book) === -1;
			});
		}, [state.text, state.books, state.cart]);

		// when the cart updates, state.total = price of books in cart
		state.total = state.cart.map(function(cart) {
			return cart.reduce((prev, next) => prev + next.price, 0);
		});

	},
	view({ state }) {
		return (
			m('div',
				m('h3', 'Book Shop'),
				m('input[type=text]', {
					placeholder: 'Filter',
					value: state.text(),
					oninput: m.withAttr('value', state.text)
				}),
				m('ul',
					state.shop() ? state.shop().map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									state.cart(state.cart().concat(book));
								}
							}, 'Add')
						)
					) : m('div', 'Loading...')
				),
				m('hr'),
				m('h3', 'Cart'),
				m('ul',
					state.cart().map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									state.cart(
										state.cart().filter((item) => item !== book)
									);
								}
							}, 'Remove')
						)
					)
				),
				m('strong', 'Total: '),
				m('span', '$', state.total())
			)
		);
	}
};