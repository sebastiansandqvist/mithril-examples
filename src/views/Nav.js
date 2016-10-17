import m from 'mithril';

const pages = [
	'Getting started',
	'Applications',
	'Requests',
	'Routing',
	'm.prop'
];

const Link = {
	view({ attrs }) {
		return (
			m('a.Nav-link', {
				href: `/${attrs.page}`,
				oncreate: m.route.link,
				className: attrs.active === attrs.page ? 'active' : ''
			}, attrs.page)
		);
	}
};

function view({ attrs }) {
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