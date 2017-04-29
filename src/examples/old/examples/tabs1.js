import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../../util/codeString.js';

const es5 = codeString(
`var tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

var tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum dolor sit amet...' },
  { id: 'Ipsum', content: 'Duis aute irure dolor in...' }
];

function Tabs() {
  var activeTab = stream(0);
  return {
    view: function(vnode) {
      return (
        m('.Tabs',
          m('.TabBar',
            attrs.tabs.map(function(tab, i) {
              return m('.Tab', {
                key: tab.id,
                className: activeTab() === i ? 'active' : '',
                onclick: function() { activeTab(i); }
              }, tab.id)
            })
          ),
          m('.TabContent', attrs.tabs[activeTab()].content)
        )
      );
    }
  };
}

var Component = {
  view: function() {
    return [
      m(Tabs, { tabs: tabContent1 }),
      m('br'),
      m(Tabs, { tabs: tabContent2 })
    ];
  }
};`);

const es6 = codeString(
`const tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

const tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum dolor sit amet...' },
  { id: 'Ipsum', content: 'Duis aute irure dolor in...' }
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
                onclick() { activeTab(i); }
              }, tab.id)
            )
          ),
          m('.TabContent', attrs.tabs[activeTab()].content)
        )
      );
    }
  };
}

const Component = {
  view() {
    return [
      m(Tabs, { tabs: tabContent1 }),
      m('br'),
      m(Tabs, { tabs: tabContent2 })
    ];
  }
};`);

const css = codeString.css(
`/* Wrapper component */
.Tabs {
  background: #2c3e50;
}

/* Top bar containing each tab's title */
.TabBar {
  background: #3a536c;
  overflow: hidden;
}

/* Each individual tab displaying the title */
.Tab {
  color: #fff;
  cursor: pointer;
  float: left;
  padding: 10px 25px;
}

.Tab.active {
  background: #2c3e50; /* matches the content's background */
  cursor: default;
}

/* The content displayed beneath the tabs */
.TabContent {
  color: #fff;
  padding: 10px 20px;
}`);


export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 },
  { id: 'css', code: css }
];


const tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

const tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  { id: 'Ipsum', content: 'Duis aute irure dolor in reprehenderit in voluptate velit' }
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
                onclick() { activeTab(i); }
              }, tab.id)
            )
          ),
          m('.TabContent', attrs.tabs[activeTab()].content)
        )
      );
    }
  };
}

export const Component = {
  view() {
    return [
      m(Tabs, { tabs: tabContent1 }),
      m('br'),
      m(Tabs, { tabs: tabContent2 })
    ];
  }
};