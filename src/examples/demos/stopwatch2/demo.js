import m from 'mithril';

function stopwatchModel() {
  return {
    interval: null,
    seconds: 0,
    isPaused: false
  };
}

const actions = {
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

export default function Stopwatch() {
  const model = stopwatchModel();
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
}