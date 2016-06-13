import React from 'react';

import Catalyst from 'react-catalyst';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import fishes from '../sample-fishes';
//Firebase API:
import Rebase from 're-base';
 var base = Rebase.createClass('https://catch-of-the-day-78ad9.firebaseio.com/');
//var base = Rebase.createClass('https://my-catch-app.firebaseio.com/');

/*
App lives here
*/

var App = React.createClass({

  mixins : [Catalyst.LinkedStateMixin],

  getInitialState : function() {
    return {
      fishes : {},
      order : {}
    }
  },

  componentDidMount : function () {
    base.syncState(this.props.params.storeID + "/fishes", {
      context : this,
      state : "fishes"
    });

    var localStorageRef = localStorage.getItem("order-" + this.props.params.storeID);

    if(localStorageRef) {
      //update our component state to reflect what is  in localStorage
      this.setState({
        order : JSON.parse(localStorageRef)
      });
    }

  },

  componentWillUpdate : function (nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeID, JSON.stringify(nextState.order));
  },

  addToOrder : function (key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state.order });
  },

  removeFromOrder : function (key) {
    delete this.state.order[key];
    this.setState({ order : this.state.order });
  },

  addFish : function(fish) {
    var timestamp = (new Date()).getTime();
    //update state object
    this.state.fishes['fish-' + timestamp] = fish;
    //set state object
    this.setState({ fishes : this.state.fishes });
  },

  removeFish : function (key) {
    if(confirm("Are you sure?")) {
    this.state.fishes[key] = null;
    this.setState({ fishes : this.state.fishes });
    }
  },

  loadSamples : function () {
    this.setState({
      fishes
    });
  },

  renderFish : function (key) {
      return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  },

  render : function () {

    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order}  removeFromOrder={this.removeFromOrder}/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish} {...this.props} />
      </div>

    )
  }
});

export default App;
