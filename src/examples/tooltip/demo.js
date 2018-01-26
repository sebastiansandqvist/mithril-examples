import m from 'mithril';

const Tooltip = {
  view({ attrs, children }) {
    return (
      m('.Tooltip-wrap',
        children,
        m('.Tooltip', attrs.value)
      )
    );
  }
};

export default {
  view() {
    return [
      m(Tooltip, { value: 'Foo' },
        m('button', 'Hover over this button')
      ),
      m(Tooltip, { value: 'Bar' },
        m('span', ' or hover here')
      )
    ];
  }
};
