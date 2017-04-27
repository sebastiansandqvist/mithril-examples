import m from 'mithril';
import codeString from '../../util/codeString.js';
import { Component as Stopwatch } from './stopwatch2.js';

const es5 = codeString(
`function App() {
  return [
    m('strong', 'Stopwatch 1: '),
    m(Stopwatch),
    m('hr'),
    m('strong', 'Stopwatch 2: '),
    m(Stopwatch)
  ];
}`);

export const code = [
  { id: 'js', code: es5 }
];

function App() {
  return [
    m('strong', 'Stopwatch 1: '),
    m(Stopwatch),
    m('hr'),
    m('strong', 'Stopwatch 2: '),
    m(Stopwatch)
  ];
}

export const Component = {
  view() {
    return App();
  }
};