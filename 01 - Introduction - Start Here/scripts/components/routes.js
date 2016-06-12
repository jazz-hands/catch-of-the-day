import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
/*
import Router from 'react-router';
import Route from 'react-router';
//import History from 'react-router';
*/
import { createHistory } from 'history';
//import createHistory from 'history';


import App from './App';
import NotFound from './NotFound';
import StorePicker from './StorePicker';

/*
 Routes
*/

var routes = (
<Router history={createHistory()}>
  <Route path="/" component={StorePicker}/>
  <Route path="/store/:storeID" component={App}/>
  <Route path="*" component={NotFound}/>
</Router>
)

export default routes;
