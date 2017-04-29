import markup from '../../util/markup.js';

export default markup(
	'In some cases it is necessary to interact directly with',
	'the rendered dom node, not just mithril virtual dom nodes.',
	'For those cases, certain lifecycle methods (including `oncreate`)',
	'provide access to the actual node through the',
	'`dom` property.',
	'This example uses it to set the height of the textarea.',
	'\n',
	'This example also relies on the fact that, in addition to being a',
	'getter-setter, any variable set to stream() can be observed for',
	'changes. Whenever the value is updated, its `map` function calls',
	'its callback with the new value. (In this case, we just ignore',
	'the new value since the height is set regardless of the specific',
	'value in the textarea.)'
);