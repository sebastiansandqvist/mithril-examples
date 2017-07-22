import codeString from '../../util/codeString.js';

const es5 = codeString(
  `var Component = {
  view: function() {
    return m('div', 'Current route: ', m.route.get());
  }
};`);

export default [
  { id: 'js', code: es5 },
];
