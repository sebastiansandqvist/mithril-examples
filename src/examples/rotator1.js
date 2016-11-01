import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var Rotator = {
  oninit: function(vnode) {
    vnode.state.list = ['One', 'Two', 'Three', 'Four'];
    vnode.state.rotate = function() {
      vnode.state.list.push(vnode.state.list.shift());
    };
  },
  view: function(vnode) {
    return (
      m('div',
        m('ul',
          state.list.map(function(item) {
            return m('li', { key: item }, item)
          }
        ),
        m('button', { onclick: state.rotate }, 'Rotate')
      )
    );
  }
};`);

const es6 = codeString(
`const Rotator = {
  oninit({ state }) {
    state.list = ['One', 'Two', 'Three', 'Four'];
    state.rotate = () => state.list.push(state.list.shift());
  },
  view({ state }) {
    return (
      m('div',
        m('ul',
          state.list.map((item) =>
            m('li', { key: item }, item)
          )
        ),
        m('button', { onclick: state.rotate }, 'Rotate')
      )
    );
  }
};`);

const jsx = codeString(
`const Rotator = {
  oninit({ state }) {
    state.list = ['One', 'Two', 'Three', 'Four'];
    state.rotate = () => state.list.push(state.list.shift());
  },
  view({ state }) {
    return (
      <div>
        <ul>
          {
            state.list.map((item) =>
              <li key={item}>{item}</li>
            )
          }
        </ul>
        <button onclick={state.rotate}>Rotate</button>
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
    state.list = ['One', 'Two', 'Three', 'Four'];
    state.rotate = () => state.list.push(state.list.shift());
  },
  view({ state }) {
    return (
      m('div',
        m('ul',
          state.list.map((item) =>
            m('li', { key: item }, item)
          )
        ),
        m('button', { onclick: state.rotate }, 'Rotate')
      )
    );
  }
};