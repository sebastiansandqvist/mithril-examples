import m from 'mithril';
import T from 's-types';
import Nav from './Nav.js';

const pageType = T({ id: T.string });

function view({ attrs, children }) {

	if (window.__DEV__) {
		pageType(attrs, 'Page');
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