import m from 'mithril';
import codeString from '../util/codeString.js';

const es5 = codeString(
`var PasswordInput = {
	oninit: function(vnode) {
		vnode.state.visible = m.prop(false);
		vnode.state.value = m.prop('');
		vnode.state.toggle = function() {
			vnode.state.visible(!vnode.state.visible());
		};
	},
	view: function(vnode) {
		return (
			m('div',
				m('input', {
					type: vnode.state.visible() ? 'text' : 'password',
					placeholder: vnode.state.visible() ?
						'password' : '••••••••',
					value: vnode.state.value(),
					oninput: m.withAttr('value', vnode.state.value)
				}),
				m('button', {
					onclick: vnode.state.toggle
				}, vnode.state.visible() ? 'Hide' : 'Show')
			)
		);
	}
};`);

const es6 = codeString(
`const PasswordInput = {
	oninit({ state }) {
		state.visible = m.prop(false);
		state.value = m.prop('');
		state.toggle = () => state.visible(!state.visible());
	},
	view({ state }) {
		return (
			m('div',
				m('input', {
					type: state.visible() ? 'text' : 'password',
					placeholder: state.visible() ? 'password' : '••••••••',
					value: state.value(),
					oninput: m.withAttr('value', state.value)
				}),
				m('button', {
					onclick: state.toggle
				}, state.visible() ? 'Hide' : 'Show')
			)
		);
	}
};`);

const jsx = codeString(
`const PasswordInput = {
	oninit({ state }) {
		state.visible = m.prop(false);
		state.value = m.prop('');
		state.toggle = () => state.visible(!state.visible());
	},
	view({ state }) {
		return (
			<div>
				<input
					type={state.visible() ? 'text' : 'password'}
					placeholder={state.visible() ? 'password' : '••••••••'}
					value={state.value()}
					oninput={m.withAttr('value', state.value)}/>
				<button onclick={state.toggle}>
					{state.visible() ? 'Hide' : 'Show'}
				</button>
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
	oninit({ state }) {
		state.visible = m.prop(false);
		state.value = m.prop('');
		state.toggle = () => state.visible(!state.visible());
	},
	view({ state }) {
		return (
			m('div',
				m('input', {
					type: state.visible() ? 'text' : 'password',
					placeholder: state.visible() ? 'password' : '••••••••',
					value: state.value(),
					oninput: m.withAttr('value', state.value)
				}),
				m('button', {
					onclick: state.toggle
				}, state.visible() ? 'Hide' : 'Show')
			)
		);
	}
};