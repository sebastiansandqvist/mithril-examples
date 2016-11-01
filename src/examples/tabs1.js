import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

var tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum...' },
  { id: 'Ipsum', content: 'Duis aute...' }
];

var Tabs = {
  oninit: function(vnode) {
    vnode.state.activeTab = m.prop(0);
  },
  view: function(vnode) {
    var active = vnode.state.activeTab();
    return (
      m('.Tabs',
        m('.TabBar',
          vnode.attrs.tabs.map(function(tab, i) {
            return m('.Tab', {
              key: tab.id,
              className: i === active ? 'active' : '',
              onclick: function() {
                vnode.state.activeTab(i);
              }
            }, tab.id)
          })
        ),
        m('.TabContent', vnode.attrs.tabs[active].content)
      )
    );
  }
};

var Component = {
  view: function() {
    return (
      m('div',
        m(Tabs, { tabs: tabContent1 }),
        m('br'),
        m(Tabs, { tabs: tabContent2 })
      )
    );
  }
};`);

const es6 = codeString(
`const tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

const tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum...' },
  { id: 'Ipsum', content: 'Duis aute...' }
];

const Tabs = {
  oninit({ state }) {
    state.activeTab = m.prop(0);
  },
  view({ attrs, state }) {
    return (
      m('.Tabs',
        m('.TabBar',
          attrs.tabs.map((tab, i) =>
            m('.Tab', {
              key: tab.id,
              className: state.activeTab() === i ? 'active' : '',
              onclick() { state.activeTab(i); }
            }, tab.id)
          )
        ),
        m('.TabContent', attrs.tabs[state.activeTab()].content)
      )
    );
  }
};

const Component = {
  view() {
    return (
      m('div',
        m(Tabs, { tabs: tabContent1 }),
        m('br'),
        m(Tabs, { tabs: tabContent2 })
      )
    );
  }
};`);

const jsx = codeString(
`const tabContent1 = [
  { id: 'One', content: 'First tab' },
  { id: 'Two', content: 'Second tab' },
  { id: 'Three', content: 'Third tab' }
];

const tabContent2 = [
  { id: 'Lorem', content: 'Lorem ipsum...' },
  { id: 'Ipsum', content: 'Duis aute...' }
];

const Tabs = {
  oninit({ state }) {
    state.activeTab = m.prop(0);
  },
  view({ attrs, state }) {
    const active = state.activeTab();
    return (
      <div className='Tabs'>
        <div className='TabBar'>
          {
            attrs.tabs.map((tab, i) =>
              <div
                key={tab.id}
                className={\`Tab $\{active === i ? 'active' : ''}\`}
                onclick={() => state.activeTab(i) }>
                {tab.id}
              </div>
            )
          }
        </div>
        <div className='TabContent'>
          {attrs.tabs[state.activeTab()].content}
        </div>
      </div>
    );
  }
};

const Component = {
  view() {
    return (
      <div>
        <Tabs tabs={tabContent1}/>
        <br/>
        <Tabs tabs={tabContent2}/>
      </div>
    );
  }
};`);

export const code = [
  { id: 'es5', code: es5 },
  { id: 'es6', code: es6 },
  { id: 'jsx', code: jsx }
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

const Tabs = {
  oninit({ state }) {
    state.activeTab = m.prop(0);
  },
  view({ attrs, state }) {
    return (
      m('.Tabs',
        m('.TabBar',
          attrs.tabs.map((tab, i) =>
            m('.Tab', {
              key: i,
              className: state.activeTab() === i ? 'active' : '',
              onclick() { state.activeTab(i); }
            }, tab.id)
          )
        ),
        m('.TabContent', attrs.tabs[state.activeTab()].content)
      )
    );
  }
};

export const Component = {
  view() {
    return (
      m('div',
        m(Tabs, { tabs: tabContent1 }),
        m('br'),
        m(Tabs, { tabs: tabContent2 })
      )
    );
  }
};