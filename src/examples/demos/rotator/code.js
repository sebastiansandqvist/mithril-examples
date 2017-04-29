import codeString from '../../../util/codeString.js';

const es5 = codeString(
`function rotate(list) {
	list.push(list.shift());
}

function Rotator() {
	var list = ['One', 'Two', 'Three', 'Four'];
	return {
		view: function() {
			return [
				m('ul', list.map(function(item) {
					return m('li', { key: item }, item)
				})),
				m('button', {
					onclick: function() {
						rotate(list);
					}
				}, 'Rotate')
			];
		}
	};
}`);

const es6 = codeString(
`const rotate = (list) => list.push(list.shift());

function Rotator() {
	const list = ['One', 'Two', 'Three', 'Four'];
	return {
		view() {
			return [
				m('ul', list.map((item) =>
					m('li', { key: item }, item)
				)),
				m('button', {
					onclick() { rotate(list); }
				}, 'Rotate')
			];
		}
	};
}`);

export default [
	{ id: 'es6', code: es6 },
	{ id: 'es5', code: es5 }
];