import m from 'mithril';
import T from 's-types';
import Nav from './Nav.js';

function view({ attrs, children }) {

	if (window.__DEV__) {
		T({ id: T.string })(attrs, 'Page');
	}

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