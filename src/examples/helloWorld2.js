import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var HelloButton = {
	view: function(vnode) {
		return m('button', 'Hello ' + vnode.attrs.title);
	}
};

var Component = {
	view: function() {
		return (
			m('div',
				m(HelloButton, { title: 'world'})
				m(HelloButton, { title: 'everyone'})
				m(HelloButton, { title: 'darkness my old friend'})
			)
		);
	}
};`);

const es6 = codeString(
`const HelloButton = {
	view({ attrs }) {
		return m('button', \`Hello $\{attrs.title}\`);
	}
};

const Component = {
	view() {
		return (
			m('div',
				m(HelloButton, { title: 'world'})
				m(HelloButton, { title: 'everyone'})
				m(HelloButton, { title: 'darkness my old friend'})
			)
		);
	}
};`);

const jsx = codeString(
`const HelloButton = {
	view({ attrs }) {
		return <button>Hello {attrs.title}</button>;
	}
};

const Component = {
	view() {
		return (
			<div>
				<HelloButton title='world'/>
				<HelloButton title='everyone'/>
				<HelloButton title='darkness my old friend'/>
			</div>
		);
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

const HelloButton = {
	view({ attrs }) {
		return m('button', `Hello ${attrs.title}`);
	}
};

export const Component = {
	view() {
		return (
			m('div',
				m(HelloButton, { title: 'world'}),
				m(HelloButton, { title: 'everyone'}),
				m(HelloButton, { title: 'darkness my old friend'})
			)
		);
	}
};
