import React from 'react';
import {History} from 'react-router';
import h from '../helpers';
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-of-the-day-78ad9.firebaseio.com/');


var StorePicker = React.createClass({
    mixins : [History],

    goToStore : function(event){
    event.preventDefault();
    //get data from input and go to App
    var storeID = this.refs.storeID.value;
    this.history.pushState(null, '/store/' + storeID);

  },

  /*
  StorePicker component
  We can make the StorePicker here
  */



      render : function() {

          return (
              <form className="store-selector" onSubmit={this.goToStore}>
              <h2>Please Enter a Store</h2>
              <input type="text" ref="storeID" defaultValue={h.getFunName()}
              required/>
              <input type="Submit"/>
            </form>
          )
        }
      });

  export default StorePicker;
