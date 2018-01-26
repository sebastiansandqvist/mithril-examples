import codeString from '../../util/codeString.js';

const es5 = codeString(
  `var stream = require('mithril/stream');
var marked = require('marked');

function MarkdownEditor() {
  var value = stream('Type some *markdown* here!');
  var markdown = value.map(marked);
  return {
    view: function() {
      return [
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', value),
          value: value()
        }),
        m('h3', 'Output'),
        m('div', m.trust(markdown()))
      ];
    }
  };
}`);

const es6 = codeString(
  `import stream from 'mithril/stream';
import marked from 'marked';

function MarkdownEditor() {
  const value = stream('Type some *markdown* here!');
  const markdown = value.map(marked);
  return {
    view() {
      return [
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', value),
          value: value()
        }),
        m('h3', 'Output'),
        m('div', m.trust(markdown()))
      ];
    }
  };
}`);


export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
