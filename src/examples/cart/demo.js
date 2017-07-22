import m from 'mithril';
import stream from 'mithril/stream';

function cartModel() {
  return {
    books: [],
    cart: [],
    query: stream(''),
    total: 0,
  };
}

const actions = {
  getResults(model) {
    const query = model.query().toLowerCase();
    return model.books.filter((book) =>
      book.name.toLowerCase().indexOf(query) > -1 &&
    model.cart.indexOf(book) === -1
    );
  },
  addToCart(model, book) {
    model.cart.push(book);
    model.total += book.price;
  },
  removeFromCart(model, book) {
    model.cart = model.cart.filter((item) => item !== book);
    model.total -= book.price;
  },
  fetchBooks(model) {
    m.request({
      method: 'GET',
      url: 'https://mithril-examples.firebaseio.com/books.json',
    }).then(function(books) {
      model.books = books || [];
    });
  },
};

const ListView = {
  view({ attrs }) {
    const model = attrs.model;
    return (
      m('ul',
        attrs.items.map((book) =>
          m('li', { key: book.id },
            m('span', book.name, ' $', book.price),
            m('button.right', {
              onclick() {
                attrs.action(model, book);
              },
            }, attrs.actionLabel)
          )
        )
      )
    );
  },
};

export default function Cart() {
  const model = cartModel();

  // fetch array of book objects from server of form:
  // { name: 'The Iliad', price: 12, id: '...' }
  actions.fetchBooks(model);

  return {
    view() {
      return [
        m('h3', 'Book Shop'),
        m('input[type=text]', {
          placeholder: 'Filter',
          value: model.query(),
          oninput: m.withAttr('value', model.query),
        }),
        m(ListView, {
          model,
          items: actions.getResults(model),
          action: actions.addToCart,
          actionLabel: 'Add',
        }),
        m('hr'),
        m('h3', 'Cart'),
        m(ListView, {
          model,
          items: model.cart,
          action: actions.removeFromCart,
          actionLabel: 'Remove',
        }),
        m('strong', 'Total: '),
        m('span', '$', model.total),
      ];
    },
  };
}