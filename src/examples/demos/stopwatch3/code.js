import codeString from '../../../util/codeString.js';

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

export default [
  { id: 'js', code: es5 }
];