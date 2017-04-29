import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';
import markup from '../util/markup.js';

import {
	code as request1,
	Component as RequestComponent1
} from '../examples/requests/request1.js';

import {
	code as request2,
	Component as RequestComponent2
} from '../examples/requests/request2.js';

function view() {
	return (
		m(Page, { id: 'Requests' },
			m('.Section',
				m('h2', 'Render fetched list'),
				m('p',
					markup(
						'[m.request](https://mithril.js.org/request.html)',
						'performs an AJAX request against a specified url and returns a promise that',
						'resolves to the data fetched from the server. After the promise chain has completed,',
						'a redraw is triggered.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: request1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RequestComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Equivalent using fetch api'),
				m('p',
					markup(
						'`m.request` is similar to the native fetch api, but adds automatic redrawing upon completion',
						'and converts the response to JSON. For comparison, the following',
						'code is the equivalent of the first example, using the native fetch api instead.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: request2 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RequestComponent2))
					)
				)
			)
		)
	);
}

const Requests = {
	view
};

export default Requests;