import codeString from '../../util/codeString.js';

const es5 = codeString(
`var Tooltip = {
	view: function(vnode) {
		return (
			m('.Tooltip-wrap',
				vnode.children,
				m('.Tooltip', vnode.attrs.value)
			)
		);
	}
};

var App = {
	view: function() {
		return [
			m(Tooltip, { value: 'Foo' },
				m('button', 'Hover over this button')
			),
			m(Tooltip, { value: 'Bar' },
				m('span', ' or hover here')
			)
		];
	}
};`);

const es6 = codeString(
`const Tooltip = {
	view({ attrs, children }) {
		return (
			m('.Tooltip-wrap',
				children,
				m('.Tooltip', attrs.value)
			)
		);
	}
};

const App = {
	view() {
		return [
			m(Tooltip, { value: 'Foo' },
				m('button', 'Hover over this button')
			),
			m(Tooltip, { value: 'Bar' },
				m('span', ' or hover here')
			)
		];
	}
};`);

const css = codeString.css(
`.Tooltip-wrap {
  display: inline-block;
  position: relative;
}

.Tooltip-wrap:hover .Tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(5px);
  transition: all .3s ease .5s;
  visibility: visible;
}

.Tooltip {
  background: rgba(0, 0, 0, .8);
  border-radius: 2px;
  bottom: -30px;
  color: white;
  font-size: 12px;
  left: 50%;
  opacity: 0;
  padding: 5px 10px;
  position: absolute;
  transform: translateX(-50%) translateY(0);
  transition: all .2s ease;
  user-select: none;
  visibility: hidden;
  white-space: nowrap;
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 },
  { id: 'css', code: css }
];
