import m from 'mithril';
import stream from 'mithril/stream';
import T from 's-types';

const tabType = T({
	fiddle: [T.string, T.optional],
	tabs: T.arrayOf(T.schema({
		id: T.string,
		code: T.string
	}))
});

function oninit({ state }) {
	state.activeIndex = stream(0);
}

function view({ attrs, state }) {

	if (window.__DEV__) {
		tabType(attrs, 'Tabs');
	}

	const fiddleButton = attrs.fiddle ? (
		m('a.FiddleLink', { href: `https://jsfiddle.net/${attrs.fiddle}/` }, 'jsFiddle')
	) : null;

	return (
		m('.Tabs.drop20',
			m('.TabBar',
				m('div',
					attrs.tabs.map((tab, i) =>
						m('.Tab', {
							key: tab.id,
							className: state.activeIndex() === i ? 'active' : '',
							onclick: () => state.activeIndex(i)
						}, tab.id)
					)
				),
				fiddleButton
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