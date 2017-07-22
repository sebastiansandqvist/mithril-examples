import m from 'mithril';

export default {
  view() {
    return (
      m('ul',
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples'),
          }, 'Examples page (root)')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples/foo'),
          }, '/examples/foo')
        ),
        m('li',
          m('button', {
            onclick: () => m.route.set('/examples/bar'),
          }, '/examples/bar')
        )
      )
    );
  },
};