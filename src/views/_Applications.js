import m from 'mithril';
import Page from './Page.js';

function view() {
	return (
		m(Page, { id: 'Applications' })
	);
}

const Applications = {
	view
};

export default Applications;