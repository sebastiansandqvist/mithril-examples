import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';

import {
	code as example1,
	Component as Component1
} from '../examples/1.js';

import {
	code as example2,
	Component as Component2
} from '../examples/2.js';

import {
	code as example3,
	Component as Component3
} from '../examples/3.js';

function view() {
	return (
		m(Page, { id: 'Getting started' },
			m('.Section',
				m('h2', 'Overview'),
				m('p', 'Mithril is a client-side MVC framework. You can read more about it at the ',
					m('a[href=http://mithril.js.org]', 'official website'), '. ',
					'This is an unofficial guide and collection of examples using the upcoming ',
					m('a[href=https://github.com/lhorie/mithril.js/tree/rewrite/docs]', '1.0 rewrite'),
					' of Mithril.js.'
				)
			),
			m('.Section',
				m('h2', 'Basic components'),
				m('p',
					'Every component is at minimum an object with a ',
					m('code.inline', 'view'),
					' method that returns a mithril virtual dom node.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: example1 })
					),
					m('.Demo-right',
						m('.Demo-result',
							m('div', m(Component1))
						)
					)
				),
				m('p',
					'The first argument to ',
					m('code.inline', 'm'),
					' is the element (as a css-like string) or component that should be rendered, and the optional last argument(s)',
					' are the children of that component.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: example2 })
					),
					m('.Demo-right',
						m('.Demo-result',
							m('div', m(Component2))
						)
					)
				),
				m('p',
					'State is passed through components via an optional second ',
					m('code.inline', 'attrs'),
					' argument to ',
					m('code.inline', 'm'),
					'. We can change the ',
					m('code.inline', 'HelloWorldButton'),
					' to have dynamic contents as follows:'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: example3 })
					),
					m('.Demo-right',
						m('.Demo-result',
							m('div', m(Component3))
						)
					)
				)
			)
		)
	);
}

const GettingStarted = {
	view
};

export default GettingStarted;