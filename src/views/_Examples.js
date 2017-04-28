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

import {
	code as className1,
	Component as ClassNameComponent1
} from '../examples/examples/classnames1.js';

import {
	code as password1,
	Component as PasswordComponent1
} from '../examples/examples/password1.js';

import {
	code as autogrow1,
	Component as AutogrowComponent1
} from '../examples/examples/autogrow1.js';

import {
	code as validation1,
	Component as ValidationComponent1
} from '../examples/examples/validation1.js';


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
			),
			m('.Section',
				m('h2', 'Dynamic class names'),
				m('p',
					markup(
						'In mithril you can set class names in two primary ways.',
						'One is in the selector:',
						'`m(\'h1.foo.bar\')`.',
						'The other is in the attributes of the vnode:',
						'`m(\'h1\', { className: \'foo bar\' })`.',
						'Knowing when to use each style may not be immediately obvious.',
						'In general, a good approach is to put class names that will not change',
						'into the selector, and to put dynamic class names in the attributes.',
						'Following this convention makes it so that mithril does not have to re-parse',
						'the selector, and typically makes view code more readable by allowing',
						'selectors to always be simple strings.',
						'\n',
						'When there are many dynamic classes in use, a common technique among',
						'mithril users is to use an array that contains each part of the class name',
						'and join it into a single class name string.',
						'\n',
						'One final thing to note is that because mithril hyperscript supports',
						'css-like selectors while JSX does not, the distinction between dynamic',
						'and static class names is of less concern to JSX users.',
						'However, JSX users can still use joined arrays for class names.',
						'A good example of this is the',
						'[lichess mobile app](https://github.com/veloce/lichobile/blob/f7936674bce5f0ca779df7e35720e056d334df1e/src/js/ui/clock/clockView.tsx#L23-L49).'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: className1 })
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
					markup(
						'In some cases it is necessary to interact directly with',
						'the rendered dom node, not just mithril virtual dom nodes.',
						'For those cases, certain lifecycle methods (including `oncreate`)',
						'provide access to the actual node through the `dom` property.',
						'This example uses it to set the height of the textarea.',
						'\n',
						'This example also relies on the fact that, in addition to being a',
						'getter-setter, any variable set to stream() can be observed for',
						'changes. Whenever the value is updated, its `map` function calls',
						'its callback with the new value. (In this case, we just ignore',
						'the new value since the height is set regardless of the specific',
						'value in the textarea.)'
					)
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: autogrow1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(AutogrowComponent1))
					)
				)
			),
			m('.Section',
				m('h2', 'Form validation'),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: validation1 })
					),
					m('.Demo-right',
						m('.Demo-result', m(ValidationComponent1))
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