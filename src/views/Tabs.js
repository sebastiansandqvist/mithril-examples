import m from 'mithril';

function oninit({ state }) {
	state.activeIndex = m.prop(0);
}

function view({ attrs, state }) {
	return (
		m('.Tabs.drop20',
			m('.TabBar',
				attrs.tabs.map((tab, i) =>
					m('.Tab', {
						key: i,
						className: state.activeIndex() === i ? 'active' : '',
						onclick: () => state.activeIndex(i)
					}, attrs.tabs[i].id)
				)
			),
			m('pre.TabContent',
				m('code', m.trust(attrs.tabs[state.activeIndex()].code))
			)
		)
	);
}

const Tabs = {
	oninit,
	view
};

export default Tabs;