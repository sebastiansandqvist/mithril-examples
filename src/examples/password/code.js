import codeString from '../../util/codeString.js';

const es5 = codeString(
`var stream = require('mithril/stream');

// toggles a stream's value
function toggle(s) {
	s(!s());
}

function PasswordInput() {
	var visible = stream(false);
	var value = stream('');
	return {
		view: function() {
			return [
				m('input', {
					type: visible() ? 'text' : 'password',
					placeholder: visible() ? 'password' : '••••••••',
					value: value(),
					oninput: m.withAttr('value', value)
				}),
				m('button', {
					onclick: function() { toggle(visible); }
				}, visible() ? 'Hide' : 'Show')
			];
		}
	};
}`);

const es6 = codeString(
`import stream from 'mithril/stream';

// toggles a stream's value
const toggle = (s) => s(!s());

function PasswordInput() {
	const visible = stream(false);
	const value = stream('');
	return {
		view() {
			return [
				m('input', {
					type: visible() ? 'text' : 'password',
					placeholder: visible() ? 'password' : '••••••••',
					value: value(),
					oninput: m.withAttr('value', value)
				}),
				m('button', {
					onclick() { toggle(visible); }
				}, visible() ? 'Hide' : 'Show')
			];
		}
	};
}`);

export default [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];
