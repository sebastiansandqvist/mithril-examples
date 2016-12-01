import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var Stopwatch = {
  oninit: function(vnode) {
    vnode.state.seconds = 0;
    vnode.state.count = function() {
      vnode.state.seconds++;
      m.redraw();
    };
    vnode.state.interval = setInterval(vnode.state.count, 1000);
  },
  onremove: function(vnode) {
    clearInterval(vnode.state.interval);
  },
  view: function(vnode) {
    return m('span', 'Timer: ' + vnode.state.seconds);
  }
};`);

const es6 = codeString(
`const Stopwatch = {
  oninit({ state }) {
    state.seconds = 0;
    state.count = () => {
      state.seconds++;
      m.redraw();
    };
    state.interval = setInterval(state.count, 1000);
  },
  onremove({ state }) {
    clearInterval(state.interval);
  },
  view({ state }) {
    return m('span', \`Timer: $\{state.seconds}\`);
  }
};`);

const jsx = codeString(
`const Stopwatch = {
  oninit({ state }) {
    state.seconds = 0;
    state.count = () => {
      state.seconds++;
      m.redraw();
    };
    state.interval = setInterval(state.count, 1000);
  },
  onremove({ state }) {
    clearInterval(state.interval);
  },
  view({ state }) {
    return <span>Timer: {state.seconds}</span>;
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

export const Component = {
  oninit({ state }) {
    state.seconds = 0;
    state.count = () => {
      state.seconds++;
      m.redraw();
    };
    state.interval = setInterval(state.count, 1000);
  },
  onremove({ state }) {
    clearInterval(state.interval);
  },
  view({ state }) {
    return m('span', `Timer: ${state.seconds}`);
  }
};
