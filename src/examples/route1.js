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

const jsx = codeString(
`const RouteView = {
  view() {
    return <div>Current route: {m.route.get()}</div>;
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

export const Component = {
  view() {
    return m('div', 'Current route: ', m.route.get());
  }
};