import m from 'mithril';

function stopwatchModel() {
  return {
    interval: null,
    seconds: 0,
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
};

export default function Stopwatch() {
  const model = stopwatchModel();
  actions.start(model);
  return {
    view: function() {
      return m('span', 'Timer: ' + model.seconds);
    },
    onremove: function() {
      actions.stop(model);
    },
  };
}
