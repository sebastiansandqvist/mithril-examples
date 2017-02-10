import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`function stopwatchFactory() {
  var model = {
    interval: null,
    seconds: 0,
    isPaused: false,
    count: function() {
      model.seconds++;
      m.redraw();
    },
    reset: function() {
      model.seconds = 0;
    },
    start: function() {
      model.interval = setInterval(model.count, 1000);
    },
    stop: function() {
      clearInterval(model.interval);
    },
    toggle: function() {
      model.isPaused = !model.isPaused;
      model.stop();
      if (!model.isPaused) {
        model.start();
      }
    }
  };
  return model;
}

var Stopwatch = {
  oninit: function(vnode) {
    vnode.state.model = stopwatchFactory();
    vnode.state.model.start();
  },
  onremove: function(vnode) {
    vnode.state.model.stop();
  },
  view: function(vnode) {
    return (
      m('div',
        m('span', 'Timer: ' + vnode.state.model.seconds),
        m('button', { onclick: vnode.state.model.reset }, 'Reset'),
        m('button', { onclick: vnode.state.model.toggle },
          vnode.state.model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};

var Component = {
  view: function() {
    return (
      m('div',
        m('h3', 'Stopwatch 1'),
        m(Stopwatch),
        m('h3', 'Stopwatch 2'),
        m(Stopwatch)
      )
    );
  }
};`);

const es6 = codeString(
`function stopwatchFactory() {
  const model = {
    interval: null,
    seconds: 0,
    isPaused: false,
    count() {
      model.seconds++;
      m.redraw();
    },
    reset() {
      model.seconds = 0;
    },
    start() {
      model.interval = setInterval(model.count, 1000);
    },
    stop() {
      clearInterval(model.interval);
    },
    toggle() {
      model.isPaused = !model.isPaused;
      model.stop();
      if (!model.isPaused) {
        model.start();
      }
    }
  };
  return model;
}

const Stopwatch = {
  oninit({ state }) {
    state.model = stopwatchFactory();
    state.model.start();
  },
  onremove({ state }) {
    state.model.stop();
  },
  view({ state }) {
    return (
      m('div',
        m('span', \`Timer: $\{state.model.seconds}\`),
        m('button', { onclick: state.model.reset }, 'Reset'),
        m('button', { onclick: state.model.toggle },
          state.model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m('h3', 'Stopwatch 1'),
        m(Stopwatch),
        m('h3', 'Stopwatch 2'),
        m(Stopwatch)
      )
    );
  }
};`);

const jsx = codeString(
`function stopwatchFactory() {
  const model = {
    interval: null,
    seconds: 0,
    isPaused: false,
    count() {
      model.seconds++;
      m.redraw();
    },
    reset() {
      model.seconds = 0;
    },
    start() {
      model.interval = setInterval(model.count, 1000);
    },
    stop() {
      clearInterval(model.interval);
    },
    toggle() {
      model.isPaused = !model.isPaused;
      model.stop();
      if (!model.isPaused) {
        model.start();
      }
    }
  };
  return model;
}

const Stopwatch = {
  oninit({ state }) {
    state.model = stopwatchFactory();
    state.model.start();
  },
  onremove({ state }) {
    state.model.stop();
  },
  view({ state }) {
    return (
      <div>
        <span>Timer: {state.model.seconds}</span>
        <button onclick={state.model.reset}>Reset</button>
        <button onclick={state.model.toggle}>
          {state.model.isPaused ? 'Start' : 'Pause'}
        </button>
      )
    );
  }
};

const Component = {
  view() {
    return (
      <div>
        <h3>Stopwatch 1</h3>
        <Stopwatch/>
        <h3>Stopwatch 2</h3>
        <Stopwatch/>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

function stopwatchFactory() {
  const model = {
    interval: null,
    seconds: 0,
    isPaused: false,
    count() {
      model.seconds++;
      m.redraw();
    },
    reset() {
      model.seconds = 0;
    },
    start() {
      model.interval = setInterval(model.count, 1000);
    },
    stop() {
      clearInterval(model.interval);
    },
    toggle() {
      model.isPaused = !model.isPaused;
      model.stop();
      if (!model.isPaused) {
        model.start();
      }
    }
  };
  return model;
}

const Stopwatch = {
  oninit({ state }) {
    state.model = stopwatchFactory();
    state.model.start();
  },
  onremove({ state }) {
    state.model.stop();
  },
  view({ state }) {
    return (
      m('div',
        m('span', `Timer: ${state.model.seconds}`),
        m('button', { onclick: state.model.reset }, 'Reset'),
        m('button', { onclick: state.model.toggle }, state.model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m('h3', 'Stopwatch 1'),
        m(Stopwatch),
        m('h3', 'Stopwatch 2'),
        m(Stopwatch)
      )
    );
  }
};