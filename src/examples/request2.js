import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var BookView = {
  oninit: function(vnode) {
    vnode.state.books = stream([]);
    fetch('https://mithril-examples.firebaseio.com/books.json')
      .then(function(response) {
        return response.json();
      })
      .then(vnode.state.books)
      .then(function() {
        m.redraw();
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
`import stream from 'mithril/stream';

const BookView = {
  oninit({ state }) {
    state.books = stream([]);
    fetch('https://mithril-examples.firebaseio.com/books.json')
      .then((response) => response.json())
      .then(state.books)
      .then(() => m.redraw());
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
`import stream from 'mithril/stream';

const BookView = {
  oninit({ state }) {
    state.books = stream([]);
    fetch('https://mithril-examples.firebaseio.com/books.json')
      .then((response) => response.json())
      .then(state.books)
      .then(() => m.redraw());
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

export const Component = {
  oninit({ state }) {
    state.books = stream([]);
    fetch('https://mithril-examples.firebaseio.com/books.json')
      .then((response) => response.json())
      .then(state.books)
      .then(() => m.redraw());
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