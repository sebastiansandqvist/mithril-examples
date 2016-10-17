import m from 'mithril';
import Nav from './Nav.js';

function view({ attrs, children }) {
	return (
		m('div',
			m('.Display',
				m('.Container',
					m('h1', 'Mithril.js examples')
				)
			),
			m(Nav, { active: attrs.id }),
			m('.Content',
				m('.Container', children)
			)
		)
	);
}

const Page = {
	view
};

export default Page;