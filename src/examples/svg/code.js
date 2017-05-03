import codeString from '../../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

function CircleSlider() {
  var size = stream(20);
  return {
    view: function() {
      return [
        m('svg',
          m('circle', {
            cx: 130,
            cy: 60,
            r: size()
          })
        ),
        m('label', 'Radius: '),
        m('input[type=range][min=1][max=100]', {
          value: size(),
          oninput: m.withAttr('valueAsNumber', size)
        }),
        m('span', size())
      ];
    }
  };
}`);

const es6 = codeString(
`import stream from 'mithril/stream';

function CircleSlider() {
  const size = stream(20);
  return {
    view() {
      return [
        m('svg',
          m('circle', {
            cx: 130,
            cy: 60,
            r: size()
          })
        ),
        m('label', 'Radius: '),
        m('input[type=range][min=1][max=100]', {
          value: size(),
          oninput: m.withAttr('valueAsNumber', size)
        }),
        m('span', size())
      ];
    }
  };
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
