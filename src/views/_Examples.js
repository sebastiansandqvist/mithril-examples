import m from 'mithril';
import markup from '../util/markup.js';
import Page from './Page.js';
import Tabs from './Tabs.js';

import {
	code as stopwatch1,
	Component as StopwatchComponent1
} from '../examples/examples/stopwatch1.js';

import {
	code as stopwatch2,
	Component as StopwatchComponent2
} from '../examples/examples/stopwatch2.js';

import {
	code as stopwatch3,
	Component as StopwatchComponent3
} from '../examples/examples/stopwatch3.js';

import {
	code as rotator1,
	Component as RotatorComponent1
} from '../examples/examples/rotator1.js';


function view() {
	return (
		m(Page, { id: 'Examples' },
			m('.Section',
				m('h2', 'Stopwatch'),
				m('p',
					markup(
						'These examples use a simple convention for state management.',
						'Models are created via factory functions, and any methods that',
						'modify an instance of a model are defined in an `actions` object.',
						'This is completely optional. Some alternatives include:'
					)
				),
				m('ul',
					m('li', m('p', markup('Using `vnode.state` to keep track of model data'))),
					m('li', m('p', 'Using state management libraries (like redux, mobx, etc.)'))
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent1))
					)
				),
				m('p',
					markup(
						'Adding a "reset" button to the stopwatch is as simple as creating the',
						'`button` element in the view and setting its `onclick` handler to a',
						'function that changes the seconds to `0`. Start/Pause functionality',
						'works similarly.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch2 })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent2))
					)
				),
				m('p', 'We can now render any number of independent stopwatches.'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch3, noTabs: true })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent3))
					)
				)
			),
			m('.Section',
				m('h2', 'List rotator'),
				m('p',
					markup(
						'When rendering a list of data, it is a good idea to supply Mithril',
						'with a `key` attribute for each element in that list.',
						'[Keys](https://mithril.js.org/keys.html) help maintain references to',
						'each element and should be unique for each item in the list.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: rotator1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RotatorComponent1))
					)
				)
			)
		)
	);
}

const Examples = {
	view
};

export default Examples;