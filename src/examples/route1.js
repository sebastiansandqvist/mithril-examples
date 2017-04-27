import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var RouteView = {
  view: function() {
    return m('div', 'Current route: ', m.route.get());
  }
};`);

const es6 = codeString(
`const RouteView = {
  view() {
    return m('div', 'Current route: ', m.route.get());
  }
};`);

export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];

export const Component = {
  view() {
    return m('div', 'Current route: ', m.route.get());
  }
};