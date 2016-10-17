import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var HelloWorldButton = {
	view(vnode) {
		return m('button', 'Hello ' + vnode.attrs.title);
	}
};`);

const es6 = codeString(
`const HelloWorldButton = {
	view({ attrs }) {
		return m('button', \`Hello $\{attrs.title}\`);
	}
};`);

const jsx = codeString(
`const HelloWorldButton = {
	view({ attrs }) {
		return <button>Hello {attrs.title}</button>;
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

export const Component = {
	view({ attrs }) {
		return m('button', `Hello ${attrs.title}`);
	}
};