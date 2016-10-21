import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var TodoList = {
	view: function(vnode) {
		return (
			m('ul',
				vnode.attrs.items.map(function(item, i) {
					return m('li', { key: i }, item);
				})
			)
		);
	}
};

var TodoApp = {
	oninit: function(vnode) {
		vnode.state.items = [];
		vnode.state.text = m.prop('');
		vnode.state.handleSubmit = function(event) {
			event.preventDefault();
			vnode.state.items.push(vnode.state.text());
			vnode.state.text('');
		};
	},
	view: function(vnode) {
		return (
			m('div',
				m('h3', 'To-do'),
				m(TodoList, { items: vnode.state.items }),
				m('form', { onsubmit: vnode.state.handleSubmit },
					m('input[type=text]', {
						oninput: m.withAttr('value', vnode.state.text),
						value: vnode.state.text()
					}),
					m('button', {
						type: 'submit'
					}, \`Add #$\{vnode.state.items.length + 1}\`)
				)
			)
		);
	}
};`);

const es6 = codeString(
`const TodoList = {
	view({ attrs }) {
		return (
			m('ul',
				attrs.items.map((item, i) =>
					m('li', { key: i }, item)
				)
			)
		);
	}
};

const TodoApp = {
	oninit({ state }) {
		state.items = [];
		state.text = m.prop('');
		state.handleSubmit = function(event) {
			event.preventDefault();
			state.items.push(state.text());
			state.text('');
		};
	},
	view({ state }) {
		return (
			m('div',
				m('h3', 'To-do'),
				m(TodoList, { items: state.items }),
				m('form', { onsubmit: state.handleSubmit },
					m('input[type=text]', {
						oninput: m.withAttr('value', state.text),
						value: state.text()
					}),
					m('button', {
						type: 'submit'
					}, \`Add #$\{state.items.length + 1}\`)
				)
			)
		);
	}
};`);

const jsx = codeString(
`const TodoList = {
	view({ attrs }) {
		return (
			<ul>
				{
					attrs.items.map((item, i) => <li key={i}>{item}</li>)
				}
			</ul>
		);
	}
};

const TodoApp = {
	oninit({ state }) {
		state.items = [];
		state.text = m.prop('');
		state.handleSubmit = function(event) {
			event.preventDefault();
			state.items.push(state.text());
			state.text('');
		};
	},
	view({ state }) {
		return (
			<div>
				<h3>To-do</h3>
				<TodoList items={state.items}/>
				<form onsubmit={state.handleSubmit}>
					<input
						type='text'
						oninput={m.withAttr('value', state.text)}/>
					<button type='submit'>
						Add #{state.items.length + 1}
					</button>
				</form>
			</div>
		);
	}
};`);

export const code = [
	{ id: 'es5', code: es5 },
	{ id: 'es6', code: es6 },
	{ id: 'jsx', code: jsx }
];

const TodoList = {
	view({ attrs }) {
		return (
			m('ul',
				attrs.items.map((item, i) =>
					m('li', { key: i }, item)
				)
			)
		);
	}
};

export const Component = {
	oninit({ state }) {
		state.items = [];
		state.text = m.prop('');
		state.handleSubmit = function(event) {
			event.preventDefault();
			state.items.push(state.text());
			state.text('');
		};
	},
	view({ state }) {
		return (
			m('div',
				m('h3', 'To-do'),
				m(TodoList, { items: state.items }),
				m('form', { onsubmit: state.handleSubmit },
					m('input[type=text]', {
						oninput: m.withAttr('value', state.text),
						value: state.text()
					}),
					m('button', { type: 'submit' }, `Add #${state.items.length + 1}`)
				)
			)
		);
	}
};