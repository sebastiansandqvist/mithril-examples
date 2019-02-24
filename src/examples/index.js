import autogrowDemo from './autogrow/demo';
import autogrowText from './autogrow/text';
import autogrowCode from './autogrow/code';

import cartDemo from './cart/demo';
import cartText from './cart/text';
import cartCode from './cart/code';

import classNamesDemo from './classNames/demo';
import classNamesText from './classNames/text';
import classNamesCode from './classNames/code';

import formValidationDemo from './formValidation/demo';
import formValidationText from './formValidation/text';
import formValidationCode from './formValidation/code';

import markdownDemo from './markdown/demo';
import markdownText from './markdown/text';
import markdownCode from './markdown/code';

import morseDemo from './morse/demo';
import morseText from './morse/text';
import morseCode from './morse/code';

import passwordDemo from './password/demo';
import passwordText from './password/text';
import passwordCode from './password/code';

import requestDemo from './request/demo';
import requestText from './request/text';
import requestCode from './request/code';

import request2Demo from './request2/demo';
import request2Text from './request2/text';
import request2Code from './request2/code';

import rotatorDemo from './rotator/demo';
import rotatorText from './rotator/text';
import rotatorCode from './rotator/code';

import routeDemo from './route/demo';
import routeText from './route/text';
import routeCode from './route/code';

import route2Demo from './route2/demo';
import route2Text from './route2/text';
import route2Code from './route2/code';

import route3Demo from './route3/demo';
import route3Text from './route3/text';
import route3Code from './route3/code';

import route4Demo from './route4/demo';
import route4Text from './route4/text';
import route4Code from './route4/code';

import stopwatchDemo from './stopwatch/demo';
import stopwatchText from './stopwatch/text';
import stopwatchCode from './stopwatch/code';

import stopwatch2Demo from './stopwatch2/demo';
import stopwatch2Text from './stopwatch2/text';
import stopwatch2Code from './stopwatch2/code';

import stopwatch3Demo from './stopwatch3/demo';
import stopwatch3Text from './stopwatch3/text';
import stopwatch3Code from './stopwatch3/code';

import svgDemo from './svg/demo';
import svgText from './svg/text';
import svgCode from './svg/code';

import todoDemo from './todo/demo';
import todoText from './todo/text';
import todoCode from './todo/code';

import tabsDemo from './tabs/demo';
import tabsText from './tabs/text';
import tabsCode from './tabs/code';

import tictactoeDemo from './tictactoe/demo';
import tictactoeText from './tictactoe/text';
import tictactoeCode from './tictactoe/code';

import tooltipDemo from './tooltip/demo';
import tooltipText from './tooltip/text';
import tooltipCode from './tooltip/code';

const tag = {
  children: { name: 'vnode.children', url: 'https://mithril.js.org/vnodes.html#structure' },
  closureComponent: { name: 'Closure Component', url: 'https://mithril.js.org/components.html#closure-components' },
  dom: { name: 'DOM', url: 'https://mithril.js.org/lifecycle-methods.html#oncreate' },
  keys: { name: 'Keys', url: 'https://mithril.js.org/keys.html' },
  lifecycle: { name: 'Lifecycle Hooks', url: 'https://mithril.js.org/lifecycle-methods.html' },
  link: { name: 'm.route.link', url: 'https://mithril.js.org/route.html#mroutelink' },
  redraw: { name: 'm.redraw', url: 'https://mithril.js.org/redraw.html' },
  request: { name: 'm.request', url: 'https://mithril.js.org/request.html' },
  route: { name: 'm.route', url: 'https://mithril.js.org/route.html' },
  trust: { name: 'm.trust', url: 'https://mithril.js.org/trust.html' },
  stream: { name: 'Stream', url: 'https://mithril.js.org/stream.html' },
  svg: { name: 'SVG', url: 'https://mithril.js.org/hyperscript.html#svg-and-mathml' }
};

const examples = [
  {
    title: 'Autogrow Textarea',
    demo: autogrowDemo,
    tags: [tag.closureComponent, tag.dom, tag.lifecycle, tag.stream],
    isOpen: false,
    description: [
      {
        text: autogrowText,
        demo: autogrowDemo,
        code: autogrowCode,
        fiddle: 'j3Lcw1vs'
      }
    ]
  },
  {
    title: 'Dynamic Class Names',
    demo: classNamesDemo,
    tags: [tag.closureComponent, tag.stream],
    isOpen: false,
    description: [
      {
        text: classNamesText,
        demo: classNamesDemo,
        code: classNamesCode,
        fiddle: 'n7qj4yfu'
      }
    ]
  },
  {
    title: 'Form Validation',
    demo: formValidationDemo,
    tags: [tag.closureComponent, tag.stream],
    isOpen: false,
    description: [
      {
        text: formValidationText,
        demo: formValidationDemo,
        code: formValidationCode,
        fiddle: '0u1kq8q5'
      }
    ]
  },
  {
    title: 'List Rotator',
    demo: rotatorDemo,
    tags: [tag.closureComponent, tag.keys],
    isOpen: false,
    description: [
      {
        text: rotatorText,
        demo: rotatorDemo,
        code: rotatorCode,
        fiddle: 's0of2sgf'
      }
    ]
  },
  {
    title: 'Markdown',
    demo: markdownDemo,
    tags: [tag.closureComponent, tag.stream, tag.trust],
    isOpen: false,
    description: [
      {
        text: markdownText,
        demo: markdownDemo,
        code: markdownCode,
        fiddle: 'waybLfm4'
      }
    ]
  },
  {
    title: 'Morse Code Player',
    demo: morseDemo,
    tags: [tag.closureComponent, tag.lifecycle, tag.redraw],
    isOpen: false,
    description: [
      {
        text: morseText,
        demo: morseDemo,
        code: morseCode,
        fiddle: '6xqhLqc2'
      }
    ]
  },
  {
    title: 'Password Input',
    demo: passwordDemo,
    tags: [tag.closureComponent, tag.stream],
    isOpen: false,
    description: [
      {
        text: passwordText,
        demo: passwordDemo,
        code: passwordCode,
        fiddle: '9ujphc65'
      }
    ]
  },
  {
    title: 'Request JSON from Server',
    demo: requestDemo,
    tags: [tag.closureComponent, tag.keys, tag.request, tag.stream],
    isOpen: false,
    description: [
      {
        text: requestText,
        demo: requestDemo,
        code: requestCode,
        fiddle: 'xjcq37c9'
      },
      {
        text: request2Text,
        demo: request2Demo,
        code: request2Code
      }
    ]
  },
  {
    title: 'Route',
    demo: routeDemo,
    tags: [tag.link, tag.route],
    isOpen: false,
    description: [
      {
        text: routeText,
        demo: routeDemo,
        code: routeCode,
        noTabs: true
      },
      {
        text: route2Text,
        demo: route2Demo,
        code: route2Code,
        noTabs: true
      },
      {
        text: route3Text,
        demo: route3Demo,
        code: route3Code,
        noTabs: true
      },
      {
        text: route4Text,
        demo: route4Demo,
        code: route4Code,
        noTabs: true
      }
    ]
  },
  {
    title: 'Shopping Cart',
    demo: cartDemo,
    tags: [tag.closureComponent, tag.keys, tag.request, tag.stream],
    isOpen: false,
    description: [
      {
        text: cartText,
        demo: cartDemo,
        code: cartCode,
        fiddle: '80rvnyrs'
      }
    ]
  },
  {
    title: 'Stopwatch', // must be unique
    demo: stopwatch2Demo,
    tags: [tag.closureComponent, tag.lifecycle, tag.redraw],
    isOpen: false,
    description: [
      {
        text: stopwatchText,
        demo: stopwatchDemo,
        code: stopwatchCode,
        fiddle: '8476ypns'
      },
      {
        text: stopwatch2Text,
        demo: stopwatch2Demo,
        code: stopwatch2Code,
        fiddle: '09nLejgz'
      },
      {
        text: stopwatch3Text,
        demo: stopwatch3Demo,
        code: stopwatch3Code,
        noTabs: true
      }
    ]
  },
  {
    title: 'SVG', // must be unique
    demo: svgDemo,
    tags: [tag.closureComponent, tag.svg],
    isOpen: false,
    description: [
      {
        text: svgText,
        demo: svgDemo,
        code: svgCode,
        fiddle: 'nbeqzdmu'
      }
    ]
  },
  {
    title: 'Tabs',
    demo: tabsDemo,
    tags: [tag.closureComponent, tag.keys, tag.stream],
    isOpen: false,
    description: [
      {
        text: tabsText,
        demo: tabsDemo,
        code: tabsCode,
        fiddle: '8v8v57wL'
      }
    ]
  },
  {
    title: 'Tic Tac Toe',
    demo: tictactoeDemo,
    tags: [tag.closureComponent],
    isOpen: false,
    description: [
      {
        text: tictactoeText,
        demo: tictactoeDemo,
        code: tictactoeCode,
        fiddle: 's4atxu0x'
      }
    ]
  },
  {
    title: 'To-do List',
    demo: todoDemo,
    tags: [tag.closureComponent, tag.stream],
    isOpen: false,
    description: [
      {
        text: todoText,
        demo: todoDemo,
        code: todoCode,
        fiddle: 'pjrpz7gg'
      }
    ]
  },
  {
    title: 'Tooltips',
    demo: tooltipDemo,
    tags: [tag.children],
    isOpen: false,
    description: [
      {
        text: tooltipText,
        demo: tooltipDemo,
        code: tooltipCode,
        fiddle: '2k4290gu'
      }
    ]
  }
];

export default examples;
