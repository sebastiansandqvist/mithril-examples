import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var ButtonView = {
  view: function() {
    return (
      m('ul',
        m('li',
          m('button', {
            onclick: function() { m.route.set('/routing') }
          }, 'Routing page (root)')
        ),
        m('li',
          m('button', {
            onclick: function() { m.route.set('/routing/foo') }
          }, '/routing/foo')
        ),
        m('li',
          m('button', {
            onclick: function() { m.route.set('/routing/bar') }
          }, '/routing/bar')
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
            onclick: () => m.route.set('/routing')
          }, 'Routing page (root)')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/routing/foo')
          }, '/routing/foo')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/routing/bar')
          }, '/routing/bar')
        )
      )
    );
  }
};`);

export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];

export const Component = {
  view() {
    return (
      m('ul',
        m('li',
          m('button', {
            onclick: () => m.route.set('/routing')
          }, 'Routing page (root)')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/routing/foo')
          }, '/routing/foo')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/routing/bar')
          }, '/routing/bar')
        )
      )
    );
  }
};