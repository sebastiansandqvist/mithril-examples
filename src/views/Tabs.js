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

const MAX_HEIGHT = 150;

function oninit({ state }) {
	state.activeIndex = stream(0);
	state.collapsed = stream(true);
	state.tabContentHeight = stream(MAX_HEIGHT + 1);
}

function view({ attrs, state }) {

	if (window.__DEV__) {
		tabType(attrs, 'Tabs');
	}

	const fiddleButton = attrs.fiddle ? (
		m('a.FiddleLink', { href: `https://jsfiddle.net/${attrs.fiddle}/` }, 'jsFiddle')
	) : null;

	const showMore = state.collapsed() && state.tabContentHeight() > MAX_HEIGHT ? (
		m('.ExpandTab', { onclick: () => state.collapsed(false) }, 'Show more...')
	) : null;

	const tabContentStyle = {
		height: state.collapsed() ? `${MAX_HEIGHT}px` : `${state.tabContentHeight()}px`
	};

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
			m('pre.TabContent', {
				style: tabContentStyle,
				oncreate({ dom }) {
					state.tabContentHeight(dom.scrollHeight);
				}
			},
				m('code', m.trust(attrs.tabs[state.activeIndex()].code))
			),
			showMore
		)
	);
}

const Tabs = {
	oninit,
	view
};

export default Tabs;