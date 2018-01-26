import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
  `function Button() {
  return m('button', 'Hello World!');
}`);

export const code = [
  { id: 'js', code: es5 }
];

function Button() {
  return m('button', 'Hello World!');
}

export const Component = {
  view() {
    return Button();
  }
};
