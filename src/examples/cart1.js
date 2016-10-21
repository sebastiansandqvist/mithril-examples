import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var ListView = {
	view: function(vnode) {
		return (
			m('ul',
					vnode.attrs.items ?
						vnode.attrs.items.map(function(book, i) {
							return m('li', { key: i },
								m('span', book.name, ' $', book.price),
								m('button.right', {
									onclick: function() {
										vnode.attrs.action(book);
									}
								}, vnode.attrs.actionLabel)
							)
					}) : m('div', 'Loading...')
			)
		);
	}
};

var BookShop = {
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
				return prev + next.price;
			}, 0);
		});

		vnode.state.addToCart = function(book) {
			vnode.state.cart(vnode.state.cart().concat(book));
		};

		vnode.state.removeFromCart = function(book) {
			vnode.state.cart(
				vnode.state.cart().filter((item) => item !== book)
			);
		};

	},
	view: function(vnode) {
		return (
			m('div',
				m('h3', 'Book Shop'),
				m('input[type=text]', {
					placeholder: 'Filter',
					value: vnode.state.text(),
					oninput: m.withAttr('value', vnode.state.text)
				}),
				m(ListView, {
					items: vnode.state.shop(),
					action: vnode.state.addToCart,
					actionLabel: 'Add'
				}),
				m('hr'),
				m('h3', 'Cart'),
				m(ListView, {
					items: vnode.state.cart(),
					action: vnode.state.removeFromCart,
					actionLabel: 'Remove'
				}),
				m('strong', 'Total: '),
				m('span', '$', vnode.state.total())
			)
		);
	}
};`);

const es6 = codeString(
`const ListView = {
	view({ attrs }) {
		return (
			m('ul',
					attrs.items ? attrs.items.map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									attrs.action(book);
								}
							}, attrs.actionLabel)
						)
					) : m('div', 'Loading...')

			)
		);
	}
};

const BookShop = {
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

		state.addToCart = function(book) {
			state.cart(state.cart().concat(book));
		};

		state.removeFromCart = function(book) {
			state.cart(
				state.cart().filter((item) => item !== book)
			);
		};

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
				m(ListView, {
					items: state.shop(),
					action: state.addToCart,
					actionLabel: 'Add'
				}),
				m('hr'),
				m('h3', 'Cart'),
				m(ListView, {
					items: state.cart(),
					action: state.removeFromCart,
					actionLabel: 'Remove'
				}),
				m('strong', 'Total: '),
				m('span', '$', state.total())
			)
		);
	}
};`);

const jsx = codeString(
`const ListView = {
	view({ attrs }) {
		return (
			<ul>
				{
					attrs.items ? attrs.items.map((book, i) =>
						<li key={i}>
							<span>{book.name} $\{book.price}</span>
							<button className='right' onclick={() => attrs.action(book)}>
								{attrs.actionLabel}
							</button>
						</li>
					) : <div>Loading...</div>
				}
			</ul>
		);
	}
};

const BookShop = {
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

		state.addToCart = function(book) {
			state.cart(state.cart().concat(book));
		};

		state.removeFromCart = function(book) {
			state.cart(
				state.cart().filter((item) => item !== book)
			);
		};

	},
	view({ state }) {
		return (
			<div>
				<h3>Book shop</h3>
				<input
					type='text'
					placeholder='filter'
					value={state.text()}
					oninput={m.withAttr('value', state.text)}/>
				<ListView
					items={state.shop()}
					action={state.addToCart}
					actionLabel='Add'/>
				<hr/>
				<h3>Cart</h3>
				<ListView
					items={state.cart()}
					action={state.removeFromCart}
					actionLabel='Remove'/>
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

const ListView = {
	view({ attrs }) {
		return (
			m('ul',
					attrs.items ? attrs.items.map((book, i) =>
						m('li', { key: i },
							m('span', book.name, ' $', book.price),
							m('button.right', {
								onclick() {
									attrs.action(book);
								}
							}, attrs.actionLabel)
						)
					) : m('div', 'Loading...')

			)
		);
	}
};

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

		state.addToCart = function(book) {
			state.cart(state.cart().concat(book));
		};

		state.removeFromCart = function(book) {
			state.cart(
				state.cart().filter((item) => item !== book)
			);
		};

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
				m(ListView, {
					items: state.shop(),
					action: state.addToCart,
					actionLabel: 'Add'
				}),
				m('hr'),
				m('h3', 'Cart'),
				m(ListView, {
					items: state.cart(),
					action: state.removeFromCart,
					actionLabel: 'Remove'
				}),
				m('strong', 'Total: '),
				m('span', '$', state.total())
			)
		);
	}
};