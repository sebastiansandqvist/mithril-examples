import m from 'mithril';
import stream from 'mithril/stream';

const tabContent = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' },
];

function Tabs() {
  const activeTab = stream(0);
  return {
    view({ attrs }) {
      return (
        m('.Tabs',
          m('.TabBar',
            attrs.tabs.map((tab, i) =>
              m('.Tab', {
                key: tab.id,
                className: activeTab() === i ? 'active' : '',
                onclick() { activeTab(i); },
              }, tab.id)
            )
          ),
          m('.TabContent', attrs.tabs[activeTab()].content)
        )
      );
    },
  };
}

export default {
  view() {
    return m(Tabs, { tabs: tabContent });
  },
};