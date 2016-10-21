import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`const HelloButton = {
  view: function(vnode) {
    return m('button', 'Hello ' + vnode.attrs.title);
  }
};

var Component = {
  oninit: function(vnode) {
    vnode.state.inputValue = ''; // initial state
  },
  view: function(vnode) {
    return (
      m('div',
        m('input[type=text]', {
          value: vnode.state.inputValue, // read from state
          oninput: function(event) {
            vnode.state.inputValue = event.target.value;
          }
        }),
        m(HelloButton, {
          title: vnode.state.inputValue
        })
      )
    );
  }
};`);

const es6 = codeString(
`const HelloButton = {
  view({ attrs }) {
    return m('button', \`Hello $\{attrs.title}\`);
  }
};

const Component = {
  oninit({ state }) {
    state.inputValue = ''; // initial state
  },
  view({ state }) {
    return (
      m('div',
        m('input[type=text]', {
          value: state.inputValue, // read from state
          oninput(event) {
            state.inputValue = event.target.value;
          }
        }),
        m(HelloButton, { title: state.inputValue })
      )
    );
  }
};`);

const jsx = codeString(
`const HelloButton = {
  view({ attrs }) {
    return <button>Hello {attrs.title}</button>;
  }
};

const Component = {
  oninit({ state }) {
    state.inputValue = ''; // initial state
  },
  view({ state }) {
    return (
      <div>
        <input
          type='text'
          value={state.inputValue}
          oninput={
            (event) => { state.inputValue = event.target.value }
          }/>
        <HelloButton title={state.inputValue}/>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

const HelloButton = {
  view({ attrs }) {
    return m('button', `Hello ${attrs.title}`);
  }
};

export const Component = {
  oninit({ state }) {
    state.inputValue = ''; // initial state
  },
  view({ state }) {
    return (
      m('div',
        m('input[type=text]', {
          value: state.inputValue, // read the value from state
          oninput(event) {
            state.inputValue = event.target.value;
          }
        }),
        m(HelloButton, { title: state.inputValue })
      )
    );
  }
};
