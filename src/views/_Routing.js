import m from 'mithril';
import markup from '../util/markup.js';
import Page from './Page.js';
import Tabs from './Tabs.js';

import {
	code as route1,
	Component as RouteComponent1
} from '../examples/route1.js';

import {
	code as route2,
	Component as RouteComponent2
} from '../examples/route2.js';

import {
	code as route3,
	Component as RouteComponent3
} from '../examples/route3.js';


function view() {
	return (
		m(Page, { id: 'Routing' },
			m('.Section',
				m('h2', 'Getting the current route'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: route1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RouteComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Setting the current route (with links)'),
				m('p',
					'When using links (',
					m('code.inline', 'a'),
					' elements), Mithril provides a method that prevents the default behavior of links ',
					'(which would refresh the page unnecessarily) and ensures that those links adhere to the ',
					'current routing mode, whether it\'s hash based, query string based, or pathname based. ',
					'For any links that do not route away from the current site, use ',
					m('code.inline', 'm.route.link'),
					' in that link\'s ',
					m('code.inline', 'oncreate'),
					' lifecycle method.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: route2 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RouteComponent2))
					)
				)
			),
			m('.Section',
				m('h2', 'Setting the current route programmatically'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: route3 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RouteComponent3))
					)
				)
			),
			m('.Section',
				m('h2', 'Further reading'),
				m('p',
					'Take a look at the ',
					m('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/route.md]', 'official router documentation'),
					' for more information on how routing works in Mithril. ',
					'The implementation of the router used for this website can be found ',
					m('a[href=https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/index.js?ts=2]', 'on github'),
					'.'
				),
				m('p',
					markup('See also: interactive [mithril router usage on JSFiddle](https://jsfiddle.net/qproodwf/).')
				)
			)
		)
	);
}

const Routing = {
	view
};

export default Routing;