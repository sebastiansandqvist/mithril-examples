import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var BookView = {
  oninit: function(vnode) {
    vnode.state.books = m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json',
      initialValue: []
    });
  },
  view: function(vnode) {
    return (
      m('div',
        m('h3', 'Books'),
        m('ul',
          vnode.state.books().map(function(book) {
            return m('li', { key: book.id }, book.name);
          })
        )
      )
    );
  }
};`);

const es6 = codeString(
`const BookView = {
  oninit({ state }) {
    state.books = m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json',
      initialValue: []
    });
  },
  view({ state }) {
    return (
      m('div',
        m('h3', 'Books'),
        m('ul',
          state.books().map((book) =>
            m('li', { key: book.id }, book.name)
          )
        )
      )
    );
  }
};`);

const jsx = codeString(
`const BookView = {
  oninit({ state }) {
    state.books = m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json',
      initialValue: []
    });
  },
  view({ state }) {
    return (
      <div>
        <h3>Books</h3>
        <ul>
          {
            state.books().map((book) =>
              <li key={book.id}>{book.name}</li>
            )
          }
        </ul>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

// Fetches an array of books objects of the form:
// { name: String, price: Number, id: Number }
export const Component = {
  oninit({ state }) {
    state.books = m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json',
      initialValue: []
    });
  },
  view({ state }) {
    return (
      m('div',
        m('h3', 'Books'),
        m('ul',
          state.books().map((book) =>
            m('li', { key: book.id }, book.name)
          )
        )
      )
    );
  }
};