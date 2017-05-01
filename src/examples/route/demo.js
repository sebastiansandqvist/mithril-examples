import m from 'mithril';

export default {
	view() {
		return m('div', 'Current route: ', m.route.get());
	}
};
