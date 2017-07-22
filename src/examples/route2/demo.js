import m from 'mithril';

export default {
  view() {
    return m('div', 'Route param x: ', m.route.param('x'));
  },
};
