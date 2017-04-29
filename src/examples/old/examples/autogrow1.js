import m from 'mithril';
import stream from 'mithril/stream';
import codeString from '../../util/codeString.js';

const es6 = codeString(
`function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = \`$\{domNode.scrollHeight}px\`;
}

function Textarea() {
	const value = stream('');
	return {
		oncreate({ dom }) {
			value.map(() => setHeight(dom));
		},
		view() {
			return m('textarea', {
				value: value(),
				oninput: m.withAttr('value', value)
			});
		}
	};
}`);

const es5 = codeString(
`function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = domNode.scrollHeight + 'px';
}

function Textarea() {
	const value = stream('');
	return {
		oncreate: function(vnode) {
			value.map(function() {
				setHeight(vnode.dom);
			});
		},
		view: function() {
			return m('textarea', {
				value: value(),
				oninput: m.withAttr('value', value)
			});
		}
	};
}`);

export const code = [
  { id: 'es6', code: es6 },
  { id: 'es5', code: es5 }
];

function setHeight(domNode) {
  domNode.style.height = ''; // reset before recalculating
  domNode.style.height = `${domNode.scrollHeight}px`;
}

export function Component() {
	const value = stream('');
	return {
		oncreate({ dom }) {
			value.map(() => setHeight(dom));
		},
		view() {
			return m('textarea', {
				value: value(),
				oninput: m.withAttr('value', value)
			});
		}
	};
}