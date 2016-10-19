import m from 'mithril';
import Page from './Page.js';

function view() {
	return (
		m(Page, { id: 'm.prop' })
	);
}

const Prop = {
	view
};

export default Prop;