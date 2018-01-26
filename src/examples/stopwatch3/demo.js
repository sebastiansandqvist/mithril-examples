import m from 'mithril';
import Stopwatch from '../stopwatch2/demo.js';

function App() {
  return [
    m('strong', 'Stopwatch 1: '),
    m(Stopwatch),
    m('hr'),
    m('strong', 'Stopwatch 2: '),
    m(Stopwatch)
  ];
}

export default {
  view() {
    return App();
  }
};
