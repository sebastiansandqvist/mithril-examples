import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var model = {
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

var Stopwatch = {
  oninit: function() {
    model.start();
  },
  onremove: function() {
    model.stop();
  },
  view: function() {
    return (
      m('div',
        m('span', 'Timer: ' + model.seconds),
        m('button', { onclick: model.reset }, 'Reset'),
        m('button', { onclick: model.toggle },
          model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};`);

const es6 = codeString(
`const model = {
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

const Stopwatch = {
  oninit() {
    model.start();
  },
  onremove() {
    model.stop();
  },
  view() {
    return (
      m('div',
        m('span', \`Timer: $\{model.seconds}\`),
        m('button', { onclick: model.reset }, 'Reset'),
        m('button', { onclick: model.toggle },
          model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};`);

const jsx = codeString(
`const model = {
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

const Stopwatch = {
  oninit() {
    model.start();
  },
  onremove() {
    model.stop();
  },
  view() {
    return (
      <div>
        <span>Timer: {model.seconds}</span>
        <button onclick={model.reset}>Reset</button>
        <button onclick={model.toggle}>
          {model.isPaused ? 'Start' : 'Pause'}
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

export const Component = {
  oninit() {
    model.start();
  },
  onremove() {
    model.stop();
  },
  view() {
    return (
      m('div',
        m('span', `Timer: ${model.seconds}`),
        m('button', { onclick: model.reset }, 'Reset'),
        m('button', { onclick: model.toggle }, model.isPaused ? 'Start' : 'Pause')
      )
    );
  }
};
