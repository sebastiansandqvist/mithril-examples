import codeString from '../../util/codeString.js';

const es5 = codeString(
`var ButtonView = {
  view: function() {
    return (
      m('ul',
        m('li',
          m('button', {
            onclick: function() { m.route.set('/examples') }
          }, 'Examples page (root)')
        ),
        m('li',
          m('button', {
            onclick: function() { m.route.set('/examples/foo') }
          }, '/examples/foo')
        ),
        m('li',
          m('button', {
            onclick: function() { m.route.set('/examples/bar') }
          }, '/examples/bar')
        )
      )
    );
  }
};`);

const es6 = codeString(
`const ButtonView = {
  view() {
    return (
      m('ul',
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples')
          }, 'Examples page (root)')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples/foo')
          }, '/examples/foo')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples/bar')
          }, '/examples/bar')
        )
      )
    );
  }
};`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
