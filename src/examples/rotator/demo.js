import m from 'mithril';

function rotate(list) {
  list.push(list.shift());
}

export default function Rotator() {
  const list = ['One', 'Two', 'Three', 'Four'];
  return {
    view() {
      return [
        m('ul', list.map((item) =>
          m('li', { key: item }, item)
        )),
        m('button', {
          onclick() { rotate(list); },
        }, 'Rotate'),
      ];
    },
  };
}
