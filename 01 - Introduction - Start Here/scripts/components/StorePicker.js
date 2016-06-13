/*
Store Picker
*/

import React from 'react';
import {History} from 'react-router';
import h from '../helpers';
import autobind from 'autobind-decorator';
import reactMixin from 'react-mixin';

@autobind
class StorePicker extends React.Component{

    goToStore(event){
      event.preventDefault();
      //get data from input and go to App
      var storeID = this.refs.storeID.value;
      this.history.pushState(null, '/store/' + storeID);
    }

    render() {

      return (
        <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeID" defaultValue={h.getFunName()}
        required/>
        <input type="Submit"/>
        </form>
        )
    }
}

  reactMixin.onClass(StorePicker, History);

  export default StorePicker;
