import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
  `var Button = {
  view: function(vnode) {
    return m('button', ['Hello ', vnode.children]);
  }
};

var App = {
  view: function() {
    return [
      m(Button, ['world']),
      m(Button, ['everybody'])
    ];
  }
};`);

export const code = [
  { id: 'js', code: es5 },
];

const Button = {
  view: function(vnode) {
    return m('button', ['Hello ', vnode.children]);
  },
};

const App = {
  view: function() {
    return [
      m(Button, ['world']),
      m(Button, ['everybody']),
    ];
  },
};

export const Component = App;