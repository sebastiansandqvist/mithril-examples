import m from 'mithril';
import T from 's-types';

const pages = [
	'Getting started',
	'Components',
	'Requests',
	'Applications',
	'Routing'
	// 'Streams'
];

const linkType = T({
	page: T.string,
	active: T.string
});

const Link = {
	view({ attrs }) {

		if (window.__DEV__) {
			linkType(attrs, 'Link');
		}

		return (
			m('a.Nav-link', {
				href: `/${attrs.page.replace(' ', '').toLowerCase()}`,
				oncreate: m.route.link,
				className: attrs.active === attrs.page ? 'active' : ''
			}, attrs.page)
		);
	}
};

const navType = T({ active: T.string });

function view({ attrs }) {

	if (window.__DEV__) {
		navType(attrs, 'Nav');
	}

	return (
		m('.Nav',
			m('.Container',
				pages.map((page) => m(Link, { page, active: attrs.active }))
			)
		)
	);
}

const Nav = {
	view
};

export default Nav;