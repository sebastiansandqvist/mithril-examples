import m from 'mithril';

function oninit({ state }) {
	state.activeIndex = 0;
	state.setActive = function(newIndex) {
		state.activeIndex = newIndex;
	};
}

function view({ attrs, state }) {
	return (
		m('.Tabs',
			m('.TabBar',
				attrs.tabs.map((tab, i) =>
					m('.Tab', {
						key: i,
						className: state.activeIndex === i ? 'active' : '',
						onclick: () => state.setActive(i)
					}, attrs.tabs[i].id)
				)
			),
			m('pre.TabContent',
				m('code', m.trust(attrs.tabs[state.activeIndex].code))
			)
		)
	);
}

const Tabs = {
	oninit,
	view
};

export default Tabs;