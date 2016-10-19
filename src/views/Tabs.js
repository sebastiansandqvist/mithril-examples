import m from 'mithril';

const activeIndex = m.prop(0);

function view({ attrs }) {
	return (
		m('.Tabs.drop20',
			m('.TabBar',
				attrs.tabs.map((tab, i) =>
					m('.Tab', {
						key: i,
						className: activeIndex() === i ? 'active' : '',
						onclick: () => activeIndex(i)
					}, attrs.tabs[i].id)
				)
			),
			m('pre.TabContent',
				m('code', m.trust(attrs.tabs[activeIndex()].code))
			)
		)
	);
}

const Tabs = {
	view
};

export default Tabs;