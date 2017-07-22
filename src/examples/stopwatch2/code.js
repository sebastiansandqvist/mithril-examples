import codeString from '../../util/codeString.js';

const es6 = codeString(
  `function stopwatchModel() {
  return {
    interval: null,
    seconds: 0,
    isPaused: false
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
  },
  reset(model) {
    model.seconds = 0;
  },
  toggle(model) {
    if (model.isPaused) {
      actions.start(model);
    }
    else {
      actions.stop(model);
    }
    model.isPaused = !model.isPaused;
  }
};

function Stopwatch() {
  const model = stopwatchModel();
  actions.start(model);
  return {
    view() {
      return (
        m('div',
          m('span', 'Timer: ' + model.seconds),
          m('button', {
            onclick() {
              actions.reset(model);
            }
          }, 'Reset'),
          m('button', {
            onclick() {
              actions.toggle(model);
            }
          }, model.isPaused ? 'Start' : 'Pause')
        )
      );
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
    seconds: 0,
    isPaused: false
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
  },
  reset: function(model) {
    model.seconds = 0;
  },
  toggle: function(model) {
    if (model.isPaused) {
      actions.start(model);
    }
    else {
      actions.stop(model);
    }
    model.isPaused = !model.isPaused;
  }
};

function Stopwatch() {
  var model = stopwatchModel();
  actions.start(model);
  return {
    view: function() {
      return (
        m('div',
          m('span', 'Timer: ' + model.seconds),
          m('button', {
            onclick: function() {
              actions.reset(model);
            }
          }, 'Reset'),
          m('button', {
            onclick: function() {
              actions.toggle(model);
            }
          }, model.isPaused ? 'Start' : 'Pause')
        )
      );
    },
    onremove: function() {
      actions.stop(model);
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 },
];