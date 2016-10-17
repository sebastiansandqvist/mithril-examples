import m from 'mithril';
import GettingStarted from './views/_GettingStarted.js';

const routes = {
	'/': GettingStarted
};

m.route(document.getElementById('app'), '/', routes);