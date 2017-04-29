import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`function Button() {
  return m('button', {
    onclick: function(event) {
      alert('Button clicked!');
    }
  }, 'Click me');
}`);

export const code = [
  { id: 'js', code: es5 }
];

function Button() {
  return m('button', {
    onclick: function() {
      alert('Button clicked!'); // eslint-disable-line no-alert
    }
  }, 'Click me');
}

const App = {
  view() {
    return Button();
  }
};

export const Component = App;