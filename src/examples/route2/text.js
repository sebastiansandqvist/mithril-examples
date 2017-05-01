import markup from '../../util/markup.js';

export default markup(
	'Given a route defined as: `/examples/:x`, the `x` part is dynamic. Use `m.route.param(\'x\')`',
	'to look up the value',
	'of that part of the url. If it isn\'t set, an empty string',
	'will be returned. Try changing the current path to `/examples/anything`',
	'and see what the result is here.',
	'\n',
	'For reference, you can view this website\'s route configuration',
	'[on github](https://github.com/sebastiansandqvist/mithril-examples/blob/master/src/index.js#L11-L19).'
);