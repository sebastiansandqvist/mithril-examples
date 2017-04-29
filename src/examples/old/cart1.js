import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var model = {
  books: [],
  cart: [],
  query: stream(''),
  total: 0,
  getResults: function(query) {
    query = query.toLowerCase();
    return model.books.filter(function(book) {
      return book.name.toLowerCase().indexOf(query) > -1 &&
        model.cart.indexOf(book) === -1;
    });
  },
  addToCart: function(book) {
    model.cart.push(book);
    model.total += book.price;
  },
  removeFromCart: function(book) {
    model.cart = model.cart.filter(function(item) {
      return item !== book;
    });
    model.total -= book.price;
  },
  fetchBooks: function() {
    m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(function(books) {
      model.books = books || [];
    });
  }
};


var ListView = {
  view: function(vnode) {
    return (
      m('ul',
        vnode.attrs.items.map(function(book) {
          return m('li', { key: book.id },
            m('span', book.name, ' $', book.price),
            m('button.right', {
              onclick: function() {
                vnode.attrs.action(book);
              }
            }, vnode.attrs.actionLabel)
          )
        })
      )
    );
  }
};

var Component = {
  oninit: function() {
    // fetch array of book objects from server of form:
    // { name: 'The Iliad', price: 12 }
    model.fetchBooks();
  },
  view: function() {
    return (
      m('div',
        m('h3', 'Book Shop'),
        m('input[type=text]', {
          placeholder: 'Filter',
          value: model.query(),
          oninput: m.withAttr('value', model.query)
        }),
        m(ListView, {
          items: model.getResults(model.query()),
          action: model.addToCart,
          actionLabel: 'Add'
        }),
        m('hr'),
        m('h3', 'Cart'),
        m(ListView, {
          items: model.cart,
          action: model.removeFromCart,
          actionLabel: 'Remove'
        }),
        m('strong', 'Total: '),
        m('span', '$', model.total)
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

const model = {
  books: [],
  cart: [],
  query: stream(''),
  total: 0,
  getResults(query) {
    return model.books.filter((book) =>
      book.name.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
        model.cart.indexOf(book) === -1
    );
  },
  addToCart(book) {
    model.cart.push(book);
    model.total += book.price;
  },
  removeFromCart(book) {
    model.cart = model.cart.filter((item) => item !== book);
    model.total -= book.price;
  },
  fetchBooks() {
    m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(function(books) {
      model.books = books || [];
    });
  }
};


const ListView = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.items.map((book) =>
          m('li', { key: book.id },
            m('span', book.name, ' $', book.price),
            m('button.right', {
              onclick() {
                attrs.action(book);
              }
            }, attrs.actionLabel)
          )
        )
      )
    );
  }
};

const Component = {
  oninit() {
    // fetch array of book objects from server of form:
    // { name: 'The Iliad', price: 12 }
    model.fetchBooks();
  },
  view() {
    return (
      m('div',
        m('h3', 'Book Shop'),
        m('input[type=text]', {
          placeholder: 'Filter',
          value: model.query(),
          oninput: m.withAttr('value', model.query)
        }),
        m(ListView, {
          items: model.getResults(model.query()),
          action: model.addToCart,
          actionLabel: 'Add'
        }),
        m('hr'),
        m('h3', 'Cart'),
        m(ListView, {
          items: model.cart,
          action: model.removeFromCart,
          actionLabel: 'Remove'
        }),
        m('strong', 'Total: '),
        m('span', '$', model.total)
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

const model = {
  books: [],
  cart: [],
  query: stream(''),
  total: 0,
  getResults(query) {
    return model.books.filter((book) =>
      book.name.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
        model.cart.indexOf(book) === -1
    );
  },
  addToCart(book) {
    model.cart.push(book);
    model.total += book.price;
  },
  removeFromCart(book) {
    model.cart = model.cart.filter((item) => item !== book);
    model.total -= book.price;
  },
  fetchBooks() {
    m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(function(books) {
      model.books = books || [];
    });
  }
};

const ListView = {
  view({ attrs }) {
    return (
      <ul>
        {
          attrs.items.map((book) =>
            <li key={book.id}>
              <span>{book.name} $\{book.price}</span>
              <button className='right' onclick={() => attrs.action(book)}>
                {attrs.actionLabel}
              </button>
            </li>
          )
        }
      </ul>
    );
  }
};


export const Component = {
  oninit() {
    // fetch array of book objects from server of form:
    // { name: 'The Iliad', price: 12 }
    model.fetchBooks();
  },
  view() {
    return (
      <div>
        <h3>Book Shop</h3>
        <input
          type="text"
          placeholder="Filter"
          value={model.query()}
          oninput={m.withAttr('value', model.query)}/>
        <ListView
          items={model.getResults(model.query())}
          action={model.addToCart}
          actionLabel="Add"/>
        <hr/>
        <h3>Cart</h3>
        <ListView
          items={model.cart}
          action={model.removeFromCart}
          actionLabel="Remove"/>
        <strong>Total: </strong>
        <span>$\{model.total}</span>
      </div>
    );
  }
};

`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const model = {
  books: [],
  cart: [],
  query: stream(''),
  total: 0,
  getResults(query) {
    return model.books.filter((book) =>
      book.name.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
        model.cart.indexOf(book) === -1
    );
  },
  addToCart(book) {
    model.cart.push(book);
    model.total += book.price;
  },
  removeFromCart(book) {
    model.cart = model.cart.filter((item) => item !== book);
    model.total -= book.price;
  },
  fetchBooks() {
    m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json'
    }).then(function(books) {
      model.books = books || [];
    });
  }
};


const ListView = {
  view({ attrs }) {
    return (
      m('ul',
        attrs.items.map((book) =>
          m('li', { key: book.id },
            m('span', book.name, ' $', book.price),
            m('button.right', {
              onclick() {
                attrs.action(book);
              }
            }, attrs.actionLabel)
          )
        )
      )
    );
  }
};

export const Component = {
  oninit() {
    // fetch array of book objects from server of form:
    // { name: 'The Iliad', price: 12 }
    model.fetchBooks();
  },
  view() {
    return (
      m('div',
        m('h3', 'Book Shop'),
        m('input[type=text]', {
          placeholder: 'Filter',
          value: model.query(),
          oninput: m.withAttr('value', model.query)
        }),
        m(ListView, {
          items: model.getResults(model.query()),
          action: model.addToCart,
          actionLabel: 'Add'
        }),
        m('hr'),
        m('h3', 'Cart'),
        m(ListView, {
          items: model.cart,
          action: model.removeFromCart,
          actionLabel: 'Remove'
        }),
        m('strong', 'Total: '),
        m('span', '$', model.total)
      )
    );
  }
};