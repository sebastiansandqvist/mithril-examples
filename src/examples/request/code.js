import codeString from '../../util/codeString.js';

const es5 = codeString(
  `var stream = require('mithril/stream');

function BookView() {
  var books = stream([]);
  m.request({
    method: 'GET',
    url: 'https://mithril-examples.firebaseio.com/books.json'
  }).then(books);
  return {
    view: function() {
      return [
        m('h3', 'Books'),
        m('ul',
          books().map(function(book) {
            return m('li', { key: book.id }, book.name);
          })
        )
      ];
    }
  };
}`);

const es6 = codeString(
  `import stream from 'mithril/stream';

function BookView() {
  const books = stream([]);
  m.request({
    method: 'GET',
    url: 'https://mithril-examples.firebaseio.com/books.json'
  }).then(books);
  return {
    view() {
      return [
        m('h3', 'Books'),
        m('ul',
          books().map((book) =>
            m('li', { key: book.id }, book.name)
          )
        )
      ];
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
