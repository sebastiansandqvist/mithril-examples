import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var ButtonView = {
	view: function() {
		return (
			m('ul',
				m('li',
					m('button', {
						onclick: function() { m.route.set('/routing') }
					}, 'Routing page (root)')
				),
				m('li',
					m('button', {
						onclick: function() { m.route.set('/routing/foo') }
					}, '/routing/foo')
				),
				m('li',
					m('button', {
						onclick: function() { m.route.set('/routing/bar') }
					}, '/routing/bar')
				)
			)
		);
	}
};`);

const es6 = codeString(
`const ButtonView = {
	view() {
		return (
			m('ul',
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing')
					}, 'Routing page (root)')
				),
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing/foo')
					}, '/routing/foo')
				),
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing/bar')
					}, '/routing/bar')
				)
			)
		);
	}
};`);

const jsx = codeString(
`const ButtonView = {
	view() {
		return (
			<ul>
				<li>
					<button onclick={() => m.route.set('/routing')}>
						Routing page (root)
					</button>
				</li>
				<li>
					<button onclick={() => m.route.set('/routing/foo')}>
						/routing/foo
					</button>
				</li>
				<li>
					<button onclick={() => m.route.set('/routing/bar')}>
						/routing/bar
					</button>
				</li>
			</ul>
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
			m('ul',
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing')
					}, 'Routing page (root)')
				),
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing/foo')
					}, '/routing/foo')
				),
				m('li',
					m('button', {
						onclick: () => m.route.set('/routing/bar')
					}, '/routing/bar')
				)
			)
		);
	}
};