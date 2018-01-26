import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
  `function App() {
  var text = '';
  return {
    view: function() {
      return [
        m('input[type=text]', {
          value: text,
          oninput: function(event) {
            text = event.target.value;
          }
        }),
        m('button', 'Hello ' + text)
      ];
    }
  };
}`);

export const code = [
  { id: 'js', code: es5 }
];

function App() {
  let text = '';
  return {
    view: function() {
      return [
        m('input[type=text]', {
          value: text,
          oninput: function(event) {
            text = event.target.value;
          }
        }),
        m('button', 'Hello ' + text)
      ];
    }
  };
}

export const Component = App;
