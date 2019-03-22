import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import * as Sentry from '@sentry/browser';
import configureStore from './store/configureStore';
import routes from './routes';
import config from './config';

require('instantsearch.css/themes/reset.css');
require('./styles/main.scss');

Sentry.init({ dsn: `https://${config.SENTRY_PUBLIC_KEY}@sentry.io/${config.SENTRY_PROJECT_ID}` });

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
let googleAnalyticsId;

switch (window.location.host) {
case 'www.askdarcel.org':
case 'askdarcel.org':
  googleAnalyticsId = 'UA-116318550-1';
  break;
case 'www.sfserviceguide.org':
case 'sfserviceguide.org':
  googleAnalyticsId = 'UA-116318550-3';
  break;
default:
  googleAnalyticsId = 'UA-116318550-2';
}

ReactGA.initialize(googleAnalyticsId);
history.listen(loc => {
  const page = loc.pathname + loc.search;
  ReactGA.set({ page });
  ReactGA.pageview(loc.pathname);
});

ReactDOM.render((
  <Provider store={store} key="provider">
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
