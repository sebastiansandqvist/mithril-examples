import markup from '../../util/markup.js';

export default markup(
	'When using links (`a` elements), Mithril provides',
	'a method that prevents the default behavior of links,',
	'which would refresh the page unnecessarily, and ensures',
	'that those links adhere to the current routing mode,',
	'whether it is hash based, query string based, or',
	'pathname based. For any links that do not route away',
	'from the current site, use `m.route.link` in the',
	'`oncreate` lifecycle method of that link.'
);