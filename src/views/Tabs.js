import m from 'mithril';

let activeIndex = 0;

function setActive(newIndex) {
	activeIndex = newIndex;
}

function view({ attrs }) {
	return (
		m('.Tabs',
			m('.TabBar',
				attrs.tabs.map((tab, i) =>
					m('.Tab', {
						key: i,
						className: activeIndex === i ? 'active' : '',
						onclick: () => setActive(i)
					}, attrs.tabs[i].id)
				)
			),
			m('pre.TabContent',
				m('code', m.trust(attrs.tabs[activeIndex].code))
			)
		)
	);
}

const Tabs = {
	view
};

export default Tabs;