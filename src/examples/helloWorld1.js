import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var HelloButton = {
	view: function() {
		return m('button', 'Hello world!');
	}
};`);

const es6 = codeString(
`const HelloButton = {
	view() {
		return m('button', 'Hello world!');
	}
};`);

const jsx = codeString(
`const HelloButton = {
	view() {
		return <button>Hello world!</button>;
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

export const Component = {
	view() {
		return m('button', 'Hello world!');
	}
};