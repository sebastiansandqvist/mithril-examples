import m from 'mithril';
import stream from 'mithril/stream';
import marked from 'marked';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

var MarkdownEditor = {
  oninit: function(vnode) {
    vnode.state.value = stream('Type some *markdown* here!');
    vnode.state.markdown = vnode.state.value.map(marked);
  },
  view: function(vnode) {
    return (
      m('div',
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', vnode.state.value),
          value: vnode.state.value()
        }),
        m('h3', 'Output'),
        m('div', m.trust(vnode.state.markdown()))
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

const MarkdownEditor = {
  oninit({ state }) {
    state.value = stream('Type some *markdown* here!');
    state.markdown = state.value.map(marked);
  },
  view({ state }) {
    return (
      m('div',
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', state.value),
          value: state.value()
        }),
        m('h3', 'Output'),
        m('div', m.trust(state.markdown()))
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

const MarkdownEditor = {
  oninit({ state }) {
    state.value = stream('Type some *markdown* here!');
    state.markdown = state.value.map(marked);
  },
  view({ state }) {
    return (
      <div>
        <h3>Input</h3>
        <textarea
          className='fullWidth'
          oninput={m.withAttr('value', state.value)}
          value{state.value()}/>
        <h3>Output</h3>
        <div>{m.trust(state.markdown())}</div>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

export const Component = {
  oninit({ state }) {
    state.value = stream('Type some *markdown* here!');
    state.markdown = state.value.map(marked);
  },
  view({ state }) {
    return (
      m('div',
        m('h3', 'Input'),
        m('textarea.fullWidth', {
          oninput: m.withAttr('value', state.value),
          value: state.value()
        }),
        m('h3', 'Output'),
        m('div', m.trust(state.markdown()))
      )
    );
  }
};