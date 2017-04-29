import m from 'mithril';
import markup from '../util/markup.js';
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
	code as stopwatch3,
	Component as StopwatchComponent3
} from '../examples/stopwatch3.js';

import {
	code as stopwatch4,
	Component as StopwatchComponent4
} from '../examples/stopwatch4.js';

import {
	code as rotator1,
	Component as RotatorComponent1
} from '../examples/rotator1.js';

import {
	code as classNames1,
	Component as ClassNameComponent1
} from '../examples/classNames1.js';

import {
	code as password1,
	Component as PasswordComponent1
} from '../examples/password1.js';

import {
	code as textarea1,
	Component as TextareaComponent1
} from '../examples/textarea1.js';

import {
	code as formValidation1,
	Component as FormValidationComponent1
} from '../examples/form-validation1.js';

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
					markup(
						'In the [Getting started](/) example there was no need to manually tell mithril to update the view when ' +
						'the contents of the input changed, because mithril automatically redraws after event handlers are ' +
						'called. In this example there are no events that trigger an update, so we tell mithril to update via ' +
						'`m.redraw`.'
					)
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
					markup(
						'Adding a reset button is as simple as creating the button element in the `view` function and setting ' +
						'its `onclick` handler to a function that changes the count to 0. Similarly, the Start/Pause toggle ' +
						'is just a button that either clears or starts a new counter.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch2, fiddle: 'nkuc6rbk' })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent2))
					)
				),
				m('p',
					'Because of the increased complexity this adds to the component, ',
					'it is a good idea to refactor it to decouple the view logic from the data.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch3, fiddle: '02jgqhyh' })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent3))
					)
				),
				m('p',
					markup(
						'However, this approach limits you to a single instance of the `Stopwatch` component. ' +
						'There are many ways to instantiate new instances of a model in order to avoid this problem. ' +
						'You could use classes, prototypes, or, as we will use in this example, factories.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: stopwatch4, fiddle: 'd8mwmh01' })
					),
					m('.Demo-right',
						m('.Demo-result', m(StopwatchComponent4))
					)
				)
			),
			m('.Section',
				m('h2', 'List rotator'),
				m('p',
					markup(
						'When rendering a list of data, it is a good idea to supply Mithril with a `key` attribute for each ' +
						'element in that list. [Keys](https://github.com/lhorie/mithril.js/blob/rewrite/docs/keys.md) help maintain ' +
						'references to each element and should be unique for each item in the list.'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: rotator1, fiddle: '5ek60qfs' })
					),
					m('.Demo-right',
						m('.Demo-result', m(RotatorComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Dynamic class names'),
				m('p',
					markup(
						'Because mithril allows you to set class names through both the selector—`m(\'h1.foo.bar\')`—and ' +
						'the attributes of the vnode—`m(\'h1\', { className: \'foo bar\' })`—knowing when to use each style may not be ' +
						'immediately obvious. In general, a good approach is to put class names that will not change into ' +
						'the selector, and to put dynamic class names in the attributes. Following this convention makes it so that ' +
						'mithril does not have to re-parse the selector, and typically makes view code more readable by ' +
						'allowing selectors to always be simple strings.'
					)
				),
				m('p',
					'When there are many dynamic classes in use, a common technique among mithril users is to ',
					'use an array that contains each part of the class name, and then join it into a single class name string.'
				),
				m('p',
					markup(
						'One final thing to note is that because mithril hyperscript supports css-like selectors while JSX does not, ' +
						'the distinction between dynamic and static class names is of less concern to JSX users. However, JSX users ' +
						'can still use joined arrays for class names. ' +
						'A good example of this is the [lichess mobile app](https://github.com/veloce/lichobile/blob/master/src/js/ui/clock/clockView.js).'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: classNames1, fiddle: 'r0pw6u3g' })
					),
					m('.Demo-right',
						m('.Demo-result', m(ClassNameComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Password input'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: password1, fiddle: 'xndgwjp4' })
					),
					m('.Demo-right',
						m('.Demo-result', m(PasswordComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Autogrow textarea'),
				m('p',
					markup(
						'In some cases it is necessary to interact directly with the rendered dom node, not ' +
						'just mithril virtual dom nodes. For those cases, certain lifecycle methods (including ' +
						'`oncreate`) provide access to the actual node through the `dom` property. This example ' +
						'uses it to set the height of the textarea.'
					)
				),
				m('p',
					markup(
						'This example also relies on the fact that, in addition to being a getter-setter, ' +
						'any variable set to `stream()`  can be observed for changes. Whenever the value is ' +
						'updated, its `map` function calls its callback with the new value. (In this case, ' +
						'we just ignore the new value since the height is set regardless of the specific contents).'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: textarea1, fiddle: 'ppcdz2ew' })
					),
					m('.Demo-right',
						m('.Demo-result', m(TextareaComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Form validation'),
				m('p',
					'While there are many ways to implement form validation, this approach tends to scale well. ',
					'Here we allow each field within the model to determine its own validation function and keep ',
					'track of its own error state. This means that in the future we could trivially add a feature to, for example, ',
					'validate each input when it is blurred.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: formValidation1, fiddle: 'ao9wagsd' })
					),
					m('.Demo-right',
						m('.Demo-result', m(FormValidationComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Tabs'),
				m('p',
					markup(
						'The only state that tabs need to keep internally is the index of the active tab. ' +
						'The example components store this state in each instance of the tabs. The implementation ' +
						'of the tabs on this site can be viewed [on github](https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/views/Tabs.js?ts=2).'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: tabs1, fiddle: '4qrxgppj' })
					),
					m('.Demo-right',
						m('.Demo-result', m(TabsComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Tooltips'),
				m('p',
					markup(
						'There are a lot of ways to implement tooltips. This implementation relies more on CSS than javascript, ' +
						'but mithril makes it easy to reuse the component. The code that defines the tooltip component just wraps ' +
						'arbitrary child components in the correct CSS class names, and allows the value of the tooltip to be ' +
						'dynamically set using `attrs.value`.'
					)
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