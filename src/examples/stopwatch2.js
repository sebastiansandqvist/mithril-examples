import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var Stopwatch = {
  oninit: function(vnode) {
    vnode.state.seconds = 0;
    vnode.state.isPaused = false;
    vnode.state.reset = function() {
      vnode.state.seconds = 0;
    };
    vnode.state.toggle = function() {
      vnode.state.isPaused = !vnode.state.isPaused;
      clearInterval(vnode.state.interval);
      if (!vnode.state.isPaused) {
        vnode.state.interval =
          setInterval(vnode.state.count, 1000);
      }
    };
    vnode.state.count = function() {
      vnode.state.seconds++;
      m.redraw();
    };
    vnode.state.interval =
      setInterval(vnode.state.count, 1000);
  },
  onremove: function(vnode) {
    clearInterval(vnode.state.interval);
  },
  view: function(vnode) {
    return (
      m('div',
        m('span', 'Timer: ' + vnode.state.seconds),
        m('button', { onclick: vnode.state.reset }, 'Reset'),
        m('button', {
          onclick: vnode.state.toggle
        }, state.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};`);

const es6 = codeString(
`const Stopwatch = {
  oninit({ state }) {
    state.seconds = 0;
    state.isPaused = false;
    state.reset = () => { state.seconds = 0; };
    state.toggle = () => {
      state.isPaused = !state.isPaused;
      clearInterval(state.interval);
      if (!state.isPaused) {
        state.interval = setInterval(state.count, 1000);
      }
    };
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
    return (
      m('div',
        m('span', \`Timer: $\{state.seconds}\`),
        m('button', { onclick: state.reset }, 'Reset'),
        m('button', {
          onclick: state.toggle
        }, state.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};`);

const jsx = codeString(
`const Stopwatch = {
  oninit({ state }) {
    state.seconds = 0;
    state.isPaused = false;
    state.reset = () => { state.seconds = 0; };
    state.toggle = () => {
      state.isPaused = !state.isPaused;
      clearInterval(state.interval);
      if (!state.isPaused) {
        state.interval = setInterval(state.count, 1000);
      }
    };
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
    return (
      <div>
        <span>Timer: {state.seconds}</span>
        <button onclick={state.reset}>Reset</button>
        <button onclick={state.toggle}>
          {state.isPaused ? 'Start' : 'Pause'}
        </button>
      )
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
    state.seconds = 0;
    state.isPaused = false;
    state.reset = () => { state.seconds = 0; };
    state.toggle = () => {
      state.isPaused = !state.isPaused;
      clearInterval(state.interval);
      if (!state.isPaused) {
        state.interval = setInterval(state.count, 1000);
      }
    };
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
    return (
      m('div',
        m('span', `Timer: ${state.seconds}`),
        m('button', { onclick: state.reset }, 'Reset'),
        m('button', { onclick: state.toggle }, state.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};
