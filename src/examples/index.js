import stopwatchDemo from './demos/stopwatch/demo';
import stopwatchText from './demos/stopwatch/text';
import stopwatchCode from './demos/stopwatch/code';

import stopwatch2Demo from './demos/stopwatch2/demo';
import stopwatch2Text from './demos/stopwatch2/text';
import stopwatch2Code from './demos/stopwatch2/code';

import stopwatch3Demo from './demos/stopwatch3/demo';
import stopwatch3Text from './demos/stopwatch3/text';
import stopwatch3Code from './demos/stopwatch3/code';

import rotatorDemo from './demos/rotator/demo';
import rotatorText from './demos/rotator/text';
import rotatorCode from './demos/rotator/code';

const tag = {
	closureComponent: { name: 'Closure Component', url: 'https://mithril.js.org/components.html#closure-components' },
	keys: { name: 'Keys', url: 'https://mithril.js.org/keys.html' },
	lifecycle: { name: 'Lifecycle Hooks', url: 'https://mithril.js.org/lifecycle-methods.html' },
	redraw: { name: 'Redraw', url: 'https://mithril.js.org/redraw.html' },
	request: { name: 'Request', url: 'https://mithril.js.org/request.html' },
	route: { name: 'Route', url: 'https://mithril.js.org/route.html' },
	stream: { name: 'Stream', url: 'https://mithril.js.org/stream.html' }
};

const examples = [
	{
		title: 'Stopwatch', // must be unique
		demo: stopwatch2Demo,
		tags: [tag.closureComponent, tag.lifecycle, tag.redraw],
		isOpen: false,
		description: [
			{
				text: stopwatchText,
				demo: stopwatchDemo,
				code: stopwatchCode
			},
			{
				text: stopwatch2Text,
				demo: stopwatch2Demo,
				code: stopwatch2Code
			},
			{
				text: stopwatch3Text,
				demo: stopwatch3Demo,
				code: stopwatch3Code,
				noTabs: true
			}
		]
	},
	{
		title: 'List Rotator',
		demo: rotatorDemo,
		tags: [tag.keys, tag.closureComponent],
		isOpen: false,
		description: [
			{
				text: rotatorText,
				demo: rotatorDemo,
				code: rotatorCode
			}
		]
	}
];

export default examples;