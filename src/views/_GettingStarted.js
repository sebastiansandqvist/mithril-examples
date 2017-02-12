import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';
import markup from '../util/markup.js';

import {
	code as helloWorld1,
	Component as HelloWorldComponent1
} from '../examples/helloWorld1.js';

import {
	code as helloWorld2,
	Component as HelloWorldComponent2
} from '../examples/helloWorld2.js';

import {
	code as helloWorld3,
	Component as HelloWorldComponent3
} from '../examples/helloWorld3.js';

import {
	code as helloWorld4,
	Component as HelloWorldComponent4
} from '../examples/helloWorld4.js';

import {
	code as helloWorldFn,
	Component as HelloWorldFnComponent
} from '../examples/helloWorld-functions.js';

import {
	code as helloWorldModel,
	Component as HelloWorldModelComponent
} from '../examples/helloWorld-model.js';

function view() {
	return (
		m(Page, { id: 'Getting started' },
			m('.Section',
				m('h2', 'Overview'),
				m('p', 'Mithril is a client-side MVC framework. You can read more about it at the ',
					m('a[href=http://mithril.js.org]', 'official website'), '. ',
					'This is an unofficial guide and collection of examples using the ',
					m('a[href=https://github.com/lhorie/mithril.js/tree/rewrite/docs]', '1.0 version'),
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
						m(Tabs, { tabs: helloWorld1, fiddle: '69b1624v' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldComponent1))
					)
				),
				m('p',
					'The first argument to ',
					m('code.inline', 'm'),
					' is the element (as a css selector-like string) or component that should be rendered, and the optional last argument(s)',
					' are the children of that component.'
				),
				m('p',
					'Components can pass properties down to their children by passing in an object as the second argument in the call to ',
					m('code.inline', 'm'),
					'. Those properties become available to the component through the ',
					m('code.inline', 'attrs'),
					' object in the mithril virtual dom node.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: helloWorld2, fiddle: 'amw7q2bv' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldComponent2))
					)
				),
				m('p',
					'In addition to the ',
					m('code.inline', 'view'),
					' method, Mithril components have a variety of ',
					m('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/lifecycle-methods.md]', 'lifecycle hooks'),
					'. Using the ',
					m('code.inline', 'oninit'),
					' lifecycle hook, which runs once immediately before rendering the component, ',
					' we can set the initial state. At this point it is worth noting that the ',
					m('code.inline', 'vnode'),
					' object that is passed to the ',
					m('code.inline', 'view'),
					' method contains, in addition to ',
					m('code.inline', 'attrs'),
					', a ',
					m('code.inline', 'state'),
					' object that can be used to store the state of that specific component.'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: helloWorld3, fiddle: 'ezh0f7sd' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldComponent3))
					)
				),
				m('p',
					'Mithril provides two utilities ',
					m('code.inline', 'm.withAttr'),
					' and ',
					m('code.inline', 'stream'),
					' (not included by default with mithril) that help simplify this process.'
				),
				m('p',
					'A ',
					m('code.inline', m('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/stream.md]', 'stream')),
					' is, at its simplest, a getter-setter function, while ',
					m('code.inline', m('a[href=https://github.com/lhorie/mithril.js/blob/rewrite/docs/withAttr.md]', 'm.withAttr')),
					' creates an event handler that uses a specified dom element property as the argument to a provided callback. ',
					'We can use them both to simplify the previous code. All together, this is the final version of this example:'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: helloWorld4, fiddle: 'br1f9qa9' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldComponent4))
					)
				)
			),
			m('.Section',
				m('h2', 'Stateless functional components'),
				m('p',
					'With mithril, it is also possible to create components in a more functional style. ',
					'The following is another acceptable way to write mithril components:'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: helloWorldFn, fiddle: 'kjwp89t3' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldFnComponent))
					)
				)
			),
			m('.Section',
				m('h2', 'Data separation'),
				m('p',
					'It is often a good idea to separate the data concerns from the view logic in your application. ',
					'For many of the simple examples presented here, state lives and dies with each component. ',
					'By instead allowing state to exist outside of the components, it can be accessed by other parts of the application. ',
					'(Also, note that one subtle difference this makes is that the state will persist even after the component unmounts.) ',
					'The example that we have been using is minimal, but it could be refactored as follows:'
				),
				m('.Demo',
					m('.Demo-left',
						m(Tabs, { tabs: helloWorldModel, fiddle: 'yszw15wy' })
					),
					m('.Demo-right',
						m('.Demo-result', m(HelloWorldModelComponent))
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