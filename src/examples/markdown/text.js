import markup from '../../util/markup.js';

export default markup(
	'We are using the [marked](https://github.com/chjj/marked) library to transform the',
	'input string into a raw html string. In the view, `m.trust` is used to bypass the',
	'input sanitization provided by default with mithril.'
);
