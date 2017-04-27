import m from 'mithril';
import codeString from '../../util/codeString.js';

const es6 = codeString(
`function stopwatchModel() {
  return {
    interval: null,
    seconds: 0
  };
}

const actions = {
  increment(model) {
    model.seconds++;
    m.redraw();
  },
  start(model) {
    model.interval = setInterval(actions.increment, 1000, model);
  },
  stop(model) {
    model.interval = clearInterval(model.interval);
  }
};

function Stopwatch() {
  const model = stopwatchModel();
  actions.start(model);
  return {
    view() {
      return m('span', \`Timer: $\{model.seconds}\`);
    },
    onremove() {
      actions.stop(model);
    }
  };
}`);

const es5 = codeString(
`function stopwatchModel() {
  return {
    interval: null,
    seconds: 0
  };
}

var actions = {
  increment: function(model) {
    model.seconds++;
    m.redraw();
  },
  start: function(model) {
    model.interval = setInterval(actions.increment, 1000, model);
  },
  stop: function(model) {
    model.interval = clearInterval(model.interval);
  }
};

function Stopwatch() {
  var model = stopwatchModel();
  actions.start(model);
  return {
    view: function() {
      return m('span', 'Timer: ' + model.seconds);
    },
    onremove: function() {
      actions.stop(model);
    }
  };
}`);

export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];

function stopwatchModel() {
  return {
    interval: null,
    seconds: 0
  };
}

var actions = {
  increment: function(model) {
    model.seconds++;
    m.redraw();
  },
  start: function(model) {
    model.interval = setInterval(actions.increment, 1000, model);
  },
  stop: function(model) {
    model.interval = clearInterval(model.interval);
  }
};

function Stopwatch() {
  var model = stopwatchModel();
  actions.start(model);
  return {
    view: function() {
      return m('span', 'Timer: ' + model.seconds);
    },
    onremove: function() {
      actions.stop(model);
    }
  };
}

export const Component = Stopwatch;