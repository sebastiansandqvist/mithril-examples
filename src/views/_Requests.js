import m from 'mithril';
import Page from './Page.js';

function view() {
	return (
		m(Page, { id: 'Requests' })
	);
}

const Requests = {
	view
};

export default Requests;