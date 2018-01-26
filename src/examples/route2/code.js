import codeString from '../../util/codeString.js';

const es5 = codeString(
  `var Component = {
  view: function() {
    return m('div', 'Route param x: ', m.route.param('x'));
  }
};`);

export default [
  { id: 'js', code: es5 }
];
