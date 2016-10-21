import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var LinkView = {
  view: function() {
    return (
      m('ul',
        m('li',
          m('a[href=/routing]', {
            oncreate: m.route.link
          }, 'Routing page (root)')
        ),
        m('li',
          m('a[href=/routing/foo]', {
            oncreate: m.route.link
          }, '/routing/foo')
        ),
        m('li',
          m('a[href=/routing/bar]', {
            oncreate: m.route.link
          }, '/routing/bar')
        )
      )
    );
  }
};`);

const es6 = codeString(
`const LinkView = {
  view() {
    return (
      m('ul',
        m('li',
          m('a[href=/routing]', {
            oncreate: m.route.link
          }, 'Routing page (root)')
        ),
        m('li',
          m('a[href=/routing/foo]', {
            oncreate: m.route.link
          }, '/routing/foo')
        ),
        m('li',
          m('a[href=/routing/bar]', {
            oncreate: m.route.link
          }, '/routing/bar')
        )
      )
    );
  }
};`);

const jsx = codeString(
`const LinkView = {
  view() {
    return (
      <ul>
        <li>
          <a href='/routing' oncreate={m.route.link}>
            Routing page (root)
          </a>
        </li>
        <li>
          <a href='/routing/foo' oncreate={m.route.link}>
            /routing/foo
          </a>
        </li>
        <li>
          <a href='/routing/bar' oncreate={m.route.link}>
            /routing/bar
          </a>
        </li>
      </ul>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
];

export const Component = {
  view() {
    return (
      m('ul',
        m('li',
          m('a[href=/routing]', {
            oncreate: m.route.link
          }, 'Routing page (root)')
        ),
        m('li',
          m('a[href=/routing/foo]', {
            oncreate: m.route.link
          }, '/routing/foo')
        ),
        m('li',
          m('a[href=/routing/bar]', {
            oncreate: m.route.link
          }, '/routing/bar')
        )
      )
    );
  }
};