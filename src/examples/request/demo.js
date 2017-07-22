import m from 'mithril';
import stream from 'mithril/stream';

export default function BookView() {
  const books = stream([]);
  m.request({
    method: 'GET',
    url: 'https://mithril-examples.firebaseio.com/books.json',
  }).then(books);
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