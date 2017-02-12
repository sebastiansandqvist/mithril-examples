import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';
import markup from '../util/markup.js';

import {
	code as todo1,
	Component as TodoComponent1
} from '../examples/todo1.js';

import {
	code as cart1,
	Component as CartComponent1
} from '../examples/cart1.js';

import {
	code as translate1,
	Component as TranslateComponent1
} from '../examples/translate1.js';

import {
	code as markdown1,
	Component as MarkdownComponent1
} from '../examples/markdown1.js';

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
						m(Tabs, { tabs: todo1, fiddle: 'qkdfhjzg' })
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
						m(Tabs, { tabs: cart1, fiddle: '7nxLvqkx' })
					),
					m('.Demo-right',
						m('.Demo-result', m(CartComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Braille Translator'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: translate1, fiddle: 'fupw6m38' })
					),
					m('.Demo-right',
						m('.Demo-result', m(TranslateComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Markdown editor'),
				m('p',
					markup(
						'Like the to-do example, this example that closely mirrors a demo application on the react.js site. ' +
						'We are using the [marked](https://github.com/chjj/marked) library to transform the ' +
						'input string into a raw html string. In the view, `m.trust` is used to bypass the ' +
						'input sanitation provided by default with mithril.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: markdown1, fiddle: '1vxsgw1y' })
					),
					m('.Demo-right',
						m('.Demo-result', m(MarkdownComponent1))
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