import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

// data
const model = {
  value: stream('')
};

// view logic
function HelloWorldButton(title) {
  return m('button', 'Hello ' + title);
}

function Input(valueStream) {
  return m('input[type=text]', {
    value: valueStream(),
    oninput: m.withAttr('value', valueStream)
  });
}

var Component = {
  view: function() {
    return (
      m('div',
        Input(model.value),
        HelloWorldButton(model.value())
      )
    );
  }
};`);

const es6 = codeString(
`import stream from 'mithril/stream';

// data
const model = {
  value: stream('')
};

// view logic
function HelloWorldButton(title) {
  return m('button', \`Hello $\{title}\`);
}

function Input(valueStream) {
  return m('input[type=text]', {
    value: valueStream(),
    oninput: m.withAttr('value', valueStream)
  });
}

const Component = {
  view() {
    return (
      m('div',
        Input(model.value),
        HelloWorldButton(model.value())
      )
    );
  }
};`);

const jsx = codeString(
`import stream from 'mithril/stream';

// data
const model = {
  value: stream('')
};

// view logic
function HelloWorldButton(title) {
  return <button>Hello {title}</button>;
}

function Input(valueStream) {
  return (
    <input
      type="text"
      value={valueStream()}
      oninput={m.withAttr('value', valueStream)}/>
  );
}

const Component = {
  view() {
    return (
      <div>
        {Input(model.value)}
        {HelloWorldButton(model.value())}
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const model = {
  value: stream('')
};

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
  view() {
    return (
      m('div',
        Input(model.value),
        HelloWorldButton(model.value())
      )
    );
  }
};