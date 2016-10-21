import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';

import {
	code as todo1,
	Component as TodoComponent1
} from '../examples/todo1.js';

import {
	code as cart1,
	Component as CartComponent1
} from '../examples/cart1.js';

function view() {
	return (
		m(Page, { id: 'Applications' },
			m('.Section',
				m('h2', 'Todo list'),
				m('p',
					'This example is ported over from the React.js documentation in order to demonstrate ',
					'some of the differences between Mithril\'s syntax and React\'s.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: todo1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(TodoComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Shopping cart'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: cart1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(CartComponent1))
					)
				)
			)
		)
	);
}

const Applications = {
	view
};

export default Applications;