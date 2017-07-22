import m from 'mithril';
import stream from 'mithril/stream';

export default function BookView() {
  const books = stream([]);
  fetch('https://mithril-examples.firebaseio.com/books.json')
    .then((response) => response.json())
    .then(books)
    .then(() => m.redraw());
  return {
    view() {
      return [
        m('h3', 'Books'),
        m('ul',
          books().map((book) =>
            m('li', { key: book.id }, book.name)
          )
        ),
      ];
    },
  };
}
