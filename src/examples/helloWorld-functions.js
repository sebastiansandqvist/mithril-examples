import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

// stateless functional component
function HelloWorldButton(title) {
  return m('button', 'Hello ' + title);
}

// stateless functional component
function Input(valueStream) {
  return m('input[type=text]', {
    value: valueStream(),
    oninput: m.withAttr('value', valueStream)
  });
}

// stateful component
var Component = {
  oninit: function(vnode) {
    vnode.state.inputValue = stream('');
  },
  view: function(vnode) {
    return (
      m('div',
        Input(vnode.state.inputValue),
        HelloWorldButton(vnode.state.inputValue())
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

// stateless functional component
function HelloWorldButton(title) {
  return m('button', \`Hello $\{title}\`);
}

// stateless functional component
function Input(valueStream) {
  return m('input[type=text]', {
    value: valueStream(),
    oninput: m.withAttr('value', valueStream)
  });
}

// stateful component
const Component = {
  oninit({ state }) {
    state.inputValue = stream('');
  },
  view({ state }) {
    return (
      m('div',
        Input(state.inputValue),
        HelloWorldButton(state.inputValue())
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

// stateless functional component
function HelloWorldButton(title) {
  return <button>Hello {title}</button>;
}

// stateless functional component
function Input(valueStream) {
  return (
    <input
      type="text"
      value={valueStream()}
      oninput={m.withAttr('value', valueStream)}/>
  );
}

// stateful component
const Component = {
  oninit({ state }) {
    state.inputValue = stream('');
  },
  view({ state }) {
    return (
      <div>
        {Input(state.inputValue)}
        {HelloWorldButton(state.inputValue())}
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

function HelloWorldButton(title) {
  return m('button', `Hello ${title}`);
}

function Input(valueStream) {
  return m('input[type=text]', {
    value: valueStream(),
    oninput: m.withAttr('value', valueStream)
  });
}

export const Component = {
  oninit({ state }) {
    state.inputValue = stream('');
  },
  view({ state }) {
    return (
      m('div',
        Input(state.inputValue),
        HelloWorldButton(state.inputValue())
      )
    );
  }
};