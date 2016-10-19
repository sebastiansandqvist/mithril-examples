import m from 'mithril';
import Page from './Page.js';

function view() {
	return (
		m(Page, { id: 'Routing' })
	);
}

const Routing = {
	view
};

export default Routing;