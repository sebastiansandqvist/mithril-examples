import m from 'mithril';
import { Component as HelloWorldButton } from './1.js';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var Component = {
	view: function() {
		return (
			m('div',
				m('input[type=text]'),
				m(HelloWorldButton)
			)
		);
	}
};`);

const es6 = codeString(
`const Component = {
	view() {
		return (
			m('div',
				m('input[type=text]'),
				m(HelloWorldButton)
			)
		);
	}
};`);

const jsx = codeString(
`const Component = {
	view() {
		return (
			<div>
				<input type='text'/>
				<HelloWorldButton/>
			</div>
		);
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

export const Component = {
	view() {
		return (
			m('div',
				m('input[type=text]'),
				m(HelloWorldButton)
			)
		);
	}
};