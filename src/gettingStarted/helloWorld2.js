import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
  `function Button(name) {
  return m('button', 'Hello ' + name);
}

function App() {
  return [
    Button('world'),
    Button('everybody')
  ];
}`);

export const code = [
  { id: 'js', code: es5 },
];

function Button(name) {
  return m('button', 'Hello ' + name);
}

function App() {
  return [
    Button('world'),
    Button('everybody'),
  ];
}

export const Component = {
  view() {
    return App();
  },
};
