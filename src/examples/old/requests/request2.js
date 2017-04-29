import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

function BookView() {
  var books = stream([]);
  fetch('https://mithril-examples.firebaseio.com/books.json')
    .then(function(response) {
      return response.json();
    })
    .then(books)
    .then(function() {
      m.redraw();
    });
  return {
    view: function() {
      return (
        m('div',
          m('h3', 'Books'),
          m('ul',
            books().map(function(book) {
              return m('li', { key: book.id }, book.name)
            })
          )
        )
      );
    }
  };
}`);

const es6 = codeString(
`import stream from 'mithril/stream';

function BookView() {
  const books = stream([]);
  fetch('https://mithril-examples.firebaseio.com/books.json')
    .then((response) => response.json())
    .then(books)
    .then(() => m.redraw());
  return {
    view() {
      return (
        m('div',
          m('h3', 'Books'),
          m('ul',
            books().map((book) =>
              m('li', { key: book.id }, book.name)
            )
          )
        )
      );
    }
  };
}`);

export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];

export function Component() {
  const books = stream([]);
  fetch('https://mithril-examples.firebaseio.com/books.json')
    .then((response) => response.json())
    .then(books)
    .then(() => m.redraw());
  return {
    view() {
      return (
        m('div',
          m('h3', 'Books'),
          m('ul',
            books().map((book) =>
              m('li', { key: book.id }, book.name)
            )
          )
        )
      );
    }
  };
}