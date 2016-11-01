import 'fetch-ie8';
import m from 'mithril';
import GettingStarted from './views/_GettingStarted.js';
import Components from './views/_Components.js';
import Applications from './views/_Applications.js';
import Requests from './views/_Requests.js';
import Routing from './views/_Routing.js';
import Streams from './views/_Streams.js';

window.__DEV__ = window.location.hostname === 'localhost';

const routes = {
	'/': GettingStarted,
	'/gettingstarted': GettingStarted,
	'/components': Components,
	'/applications': Applications,
	'/requests': Requests,
	'/routing': Routing,
	'/routing/:param': Routing,
	'/streams': Streams
};

m.route.prefix('');
m.route(document.getElementById('app'), '/', routes);