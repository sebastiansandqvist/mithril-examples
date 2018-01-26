import m from 'mithril';
import Page from './Page.js';
import Tabs from './Tabs.js';
import markup from '../util/markup.js';

import {
  code as helloWorld1,
  Component as HelloWorldComponent1
} from '../gettingStarted/helloWorld1.js';

import {
  code as helloWorld2,
  Component as HelloWorldComponent2
} from '../gettingStarted/helloWorld2.js';

import {
  code as helloWorld3,
  Component as HelloWorldComponent3
} from '../gettingStarted/helloWorld3.js';

import {
  code as helloWorld4,
  Component as HelloWorldComponent4
} from '../gettingStarted/helloWorld4.js';

import {
  code as helloWorld5,
  Component as HelloWorldComponent5
} from '../gettingStarted/helloWorld5.js';

import {
  code as helloWorld6,
  Component as HelloWorldComponent6
} from '../gettingStarted/helloWorld6.js';


function view() {
  return (
    m(Page, { id: 'Getting started' },
      m('.Section',
        m('h2', 'Overview'),
        m('p',
          markup(
            'Mithril is a client-side MVC framework. You can read more about it at the [official website](https://mithril.js.org).',
            'This is an unofficial guide and collection of examples using Mithril version 1.1 and above.'
          )
        )
      ),
      m('.Section',
        m('h2', 'Virtual DOM'),
        m('p',
          markup(
            'Mithril exports a single function `m()` that creates virtual DOM nodes.',
            'To create a button, we could do the following:'
          )
        ),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld1, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent1))
          )
        ),
        m('p.clear', 'Passing in custom parameters is simple:'),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld2, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent2))
          )
        ),
        m('p.clear',
          markup(
            'This approach works very well for simple components, but you will often need to store state within components',
            'or use [lifecycle methods](https://mithril.js.org/lifecycle-methods.html). For those cases, the idiomatic ',
            'component syntax used in mithril (described below) is recommended.'
          )
        )
      ),
      m('.Section',
        m('h2', 'Components'),
        m('p',
          markup(
            'At their simplest, components are an object with a `view` method that returns some virtual DOM.',
            'The previous example could be rewritten this way:'
          )
        ),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld3, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent3))
          )
        ),
        m('p.clear',
          markup(
            'We can now render this component in the same way we render a virtual DOM element, using `m()`.',
            'Mithril passes the last argument(s) in the call to `m()` as children to the virtual DOM node.',
            'We could also pass in an object as the second argument and those would be available as',
            'attributes (`attrs`) in the virtual DOM node (`vnode`). For example:'
          )
        ),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld4, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent4))
          )
        )
      ),
      m('.Section',
        m('h2', 'Attributes and events'),
        m('p',
          markup(
            'Attributes can be supplied to elements in two ways.',
            'One way is to use a css-like string. For instance:',
            '`m(\'input[type=text][value=foo]\')`.',
            'This will create a text input with the value `foo`.',
            'The other way, which is recommended for event handlers and any attributes that may change,',
            'is to pass the attributes in an object as the second argument to `m()`.'
          )
        ),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld5, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent5))
          )
        )
      ),
      m('.Section',
        m('h2', 'Closure components'),
        m('p',
          markup(
            'When components become more complex, they may need to manage some internal state.',
            'Closure components, which are just functions that return a plain object component, make this possible.'
          )
        ),
        m('.Demo',
          m('.Demo-left',
            m(Tabs, { tabs: helloWorld6, noTabs: true })
          ),
          m('.Demo-right',
            m('.Demo-result', m(HelloWorldComponent6))
          )
        ),
        m('p.clear',
          markup(
            'The [examples](/) on this site will use closure component syntax in most cases',
            'where there is internal state to manage. However, there are',
            '[alternative ways](https://mithril.js.org/components.html#syntactic-variants) to write',
            'functionally identical components.'
          )
        )
      ),
      m('.Section',
        m('.center',
          m('a.Button.Button--large[href=/]', {
            // since mithril does not scroll to top by default
            onclick() { window.scrollTo(0); }
          }, 'View mithril examples →')
        )
      ),
      m('.Section',
        m('h2', 'Further reading'),
        m('p',
          markup(
            'The rest of the [examples](/) on this site assume some familiarity with Mithril.',
            'This Getting Started guide should be enough to have you familiar with the basic syntax,',
            'but some Mithril features will be used that have not been documented here. Consult the',
            '[official docs](https://mithril.js.org) in case something you read on this site is confusing.'
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
