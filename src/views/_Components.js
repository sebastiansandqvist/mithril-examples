import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';

import {
	code as stopwatch1,
	Component as StopwatchComponent1
} from '../examples/stopwatch1.js';

import {
	code as stopwatch2,
	Component as StopwatchComponent2
} from '../examples/stopwatch2.js';

import {
	code as rotator1,
	Component as RotatorComponent1
} from '../examples/rotator1.js';

import {
	code as password1,
	Component as PasswordComponent1
} from '../examples/password1.js';

import {
	code as textarea1,
	Component as TextareaComponent1
} from '../examples/textarea1.js';

import {
	code as tabs1,
	Component as TabsComponent1
} from '../examples/tabs1.js';

import {
	code as tooltip1,
	Component as TooltipComponent1
} from '../examples/tooltip1.js';

function view() {
	return (
		m(Page, { id: 'Components' },
			m('.Section',
				m('h2', 'Stopwatch'),
				m('p',
					'In the ',
					m('a[href=/]', { oncreate: m.route.link }, 'Getting started'),
					' example there was no need to manually tell mithril to update the view when ',
					'the contents of the input changed, because mithril automatically redraws after event handlers ',
					'are called. In this example there are no events that trigger an update, so we tell mithril to update via ',
					m('code.inline', 'm.redraw'),
					'.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch1, fiddle: 'ckap5y2g' })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent1))
					)
				),
				m('p',
					'Adding a reset button is as simple as creating the button element in the ',
					m('code.inline', 'view'),
					' function and setting its ',
					m('code.inline', 'onclick'),
					' handler to a function that changes the count to 0. Similarly, the Start/Pause toggle',
					' is just a button that either clears or starts a new counter.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch2, fiddle: 'nkuc6rbk' })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent2))
					)
				)
			),
			m('.Section',
				m('h2', 'List rotator'),
				m('p',
					'When rendering a list of data, it is a good idea to supply Mithril with a ',
					m('code.inline', 'key'),
					' attribute for each element in that list. ',
					m('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/keys.md]', 'Keys'),
					' help Mithril maintain references to each element and should be unique for each item in the list.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: rotator1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(RotatorComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Password input'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: password1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(PasswordComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Autogrow textarea'),
				m('p',
					'In some cases it is necessary to interact directly with the rendered dom node, not ',
					'just mithril virtual dom nodes. For those cases, certain lifecycle methods (including ',
					m('code.inline', 'oncreate'),
					') provide access to the actual node through the ',
					m('code.inline', 'dom'),
					' property. This example uses it to set the height of the textarea.'
				),
				m('p',
					'This example also relies on the fact that, in addition to being a getter-setter, ',
					'any variable set to ',
					m('code.inline', 'm.prop()'),
					' can be observed for changes. Whenever the value is updated, its ',
					m('code.inline', 'map'),
					' function calls its callback with the new value. (In this case, we just ignore the ',
					' new value since the height is set regardless of the specific contents).'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: textarea1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(TextareaComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Tabs'),
				m('p',
					'The only state that tabs need to keep internally is the index of the active tab. The example components ',
					'store this state in each instance of the tabs. The implementation of the tabs on this site can be viewed ',
					m('a[href=https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/views/Tabs.js?ts=2]', 'on github'),
					'.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: tabs1, fiddle: 'h2vftbr8' })
					),
					m('.Demo-right',
						m('.Demo-result', m(TabsComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Tooltips'),
				m('p',
					'There are a lot of ways to implement tooltips. This implementation relies more on CSS than javascript, ',
					'but mithril makes it easy to reuse the component. The code that defines the tooltip component just wraps ',
					'arbitrary child components in the correct CSS class names, and allows the value of the tooltip to be ',
					'dynamically set using ',
					m('code.inline', 'attrs.value'),
					'.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: tooltip1, fiddle: '181vwbL8' })
					),
					m('.Demo-right',
						m('.Demo-result', m(TooltipComponent1))
					)
				)
			)
		)
	);
}

const Components = {
	view
};

export default Components;