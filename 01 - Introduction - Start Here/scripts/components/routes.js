import React from 'react';

import ReactRouter from 'react-router';

import Router from 'react-router';
import Route from 'react-router';
//import History from 'react-router';

import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './App';
import NotFound from './NotFound';
import StorePicker from './StorePicker';

/*
 Routes
*/

var routes = (
<Router history={createBrowserHistory()}>
  <Route path="/" component={StorePicker}/>
  <Route path="/store/:storeID" component={App}/>
  <Route path="*" component={NotFound}/>
</Router>
)

export default routes;
