import React from 'react';
//import Rebase from 're-base';
import AddFishForm from './AddFishForm';
import h from '../helpers';

//Inventory <Inventory/>

var Inventory = React.createClass({

  renderInventory : function (key) {
    var linkState = this.props.linkState;

    return(
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish} key={key}>
      <input type="text" valueLink={linkState("fishes." + key + ".name")}/>
      <input type="text" valueLink={linkState("fishes." + key + ".price")}/>
      <select valueLink={linkState("fishes." + key + ".status")}>
        <option value="available">Fresh!</option>
        <option value="unavailable">Sold Out!</option>
      </select>
      <textarea type="text" valueLink={linkState("fishes." + key + ".desc")}></textarea>
      <input type="text" valueLink={linkState("fishes." + key + ".image")}/>
      <button onClick={this.props.removeFish.bind(null, key)}> Remove Fish</button>
      </form>
    )
  },

  propTypes : {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
  },

  render : function(){
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
});

export default Inventory;
