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

const asyncRederaw = () => requestAnimationFrame(m.redraw);

function FiddleButton(id) {
	return id ? m('a.FiddleLink', { href: `https://jsfiddle.net/${id}/` }, 'jsFiddle') : null;
}

function ShowMore(collapsed, onclick, height = 0) {
	return collapsed && (height > MAX_HEIGHT) ? (
		m('.ExpandTab', { onclick }, 'Show more...')
	) : null;
}

const px = (n) => `${n}px`;

export default function Tabs({ attrs }) {
	const activeIndex = stream(0);
	const collapsed = stream(true);
	const tabContentHeight = stream();
	tabContentHeight.map(asyncRederaw);
	return {
		view() {

			tabType(attrs, 'Tabs');

			return (
				m('.Tabs.drop20',
					m('.TabBar',
						m('div',
							attrs.tabs.map((tab, i) =>
								m('.Tab', {
									key: tab.id,
									className: activeIndex() === i ? 'active' : '',
									onclick: () => activeIndex(i)
								}, tab.id)
							)
						),
						FiddleButton(attrs.fiddle)
					),
					m('pre.TabContent', {
						oncreate({ dom }) {
							if (dom.scrollHeight <= MAX_HEIGHT) {
								collapsed(false);
							}
							tabContentHeight(dom.scrollHeight);
						},
						onupdate({ dom }) {
							if (tabContentHeight() !== dom.scrollHeight) {
								tabContentHeight(dom.scrollHeight);
							}
						},
						style: {
							height: collapsed() ? px(Math.min(MAX_HEIGHT, tabContentHeight() || 0)) : px(tabContentHeight())
						}
					},
						m('code', m.trust(attrs.tabs[activeIndex()].code))
					),
					ShowMore(collapsed(), () => collapsed(false), tabContentHeight())
				)
			);

		}
	};
}