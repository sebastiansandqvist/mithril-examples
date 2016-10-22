import m from 'mithril';
import Page from './Page.js';

function view() {
	return (
		m(Page, { id: 'Streams' },
			m('.Section',
				m('h2', '...')
			)
		)
	);
}

const Prop = {
	view
};

export default Prop;