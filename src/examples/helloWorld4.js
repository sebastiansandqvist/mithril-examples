import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var HelloWorldButton = {
  view: function(vnode) {
    return m('button', 'Hello ' + vnode.attrs.title);
  }
};

var Component = {
  oninit: function(vnode) {
    vnode.state.inputValue = m.prop('');
  },
  view: function(vnode) {
    return (
      m('div',
        m('input[type=text]', {
          value: vnode.state.inputValue(),
          oninput: m.withAttr('value', vnode.state.inputValue)
        }),
        m(HelloWorldButton, {
          title: vnode.state.inputValue()
        })
      )
    );
  }
};`);

const es6 = codeString(
`const HelloWorldButton = {
  view({ attrs }) {
    return m('button', \`Hello $\{attrs.title}\`);
  }
};

const Component = {
  oninit({ state }) {
    state.inputValue = m.prop('');
  },
  view({ state }) {
    return (
      m('div',
        m('input[type=text]', {
          value: state.inputValue(),
          oninput: m.withAttr('value', state.inputValue)
        }),
        m(HelloWorldButton, { title: state.inputValue() })
      )
    );
  }
};`);

const jsx = codeString(
`const HelloWorldButton = {
  view({ attrs }) {
    return <button>Hello {attrs.title}</button>;
  }
};

const Component = {
  oninit({ state }) {
    state.inputValue = m.prop('');
  },
  view({ state }) {
    return (
      <div>
        <input
          type='text'
          value={state.inputValue()}
          oninput={m.withAttr('value', state.inputValue)}/>
        <HelloWorldButton title={state.inputValue()}/>
      </div>
    );
  }
}`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const HelloWorldButton = {
  view({ attrs }) {
    return m('button', `Hello ${attrs.title}`);
  }
};

export const Component = {
  oninit({ state }) {
    state.inputValue = m.prop('');
  },
  view({ state }) {
    return (
      m('div',
        m('input[type=text]', {
          value: state.inputValue(),
          oninput: m.withAttr('value', state.inputValue)
        }),
        m(HelloWorldButton, { title: state.inputValue() })
      )
    );
  }
};
