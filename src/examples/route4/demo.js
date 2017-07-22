import m from 'mithril';

export default {
  view() {
    return (
      m('ul',
        m('li',
          m('a[href=/examples]', {
            oncreate: m.route.link,
          }, 'Examples page (root)')
        ),
        m('li',
          m('a[href=/examples/foo]', {
            oncreate: m.route.link,
          }, '/examples/foo')
        ),
        m('li',
          m('a[href=/examples/bar]', {
            oncreate: m.route.link,
          }, '/examples/bar')
        )
      )
    );
  },
};
