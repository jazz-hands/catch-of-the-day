import React from 'react';
import Rebase from 're-base';
import AddFishForm from './AddFishForm';
import h from '../helpers';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://catch-of-the-day-78ad9.firebaseio.com/');

//Inventory <Inventory/>

@autobind
class Inventory extends React.Component{

  constructor() {
    super();

    this.state = {
      uid : ''
    }
  }

  authenticate(provider){
    ref.authWithOAuthPopup(provider, function(err, authData) {
      console.log(authData);
    });
  }

  componentWillMount(){
    var token = localStorage.getItem('token');
    if(token){
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  logout(){
    ref.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null
    })
  }

  authHandler(err, authData){
    if(err){
      console.log(err);
      return;
    }

    //save the login token in the browser
    localStorage.setItem('token', authData.token);

    const storeRef = ref.child(this.props.params.storeID);
    storeRef.on('value', (snapshot)=>{
      var data = snapshot.val() || {};
      //if no owner claim as owner
      if(!data.owner){
        storeRef.set({
          uid : authData.uid,
          owner : data.owner || authData.uid
        });
      }
    });
  }

  renderLogin(){
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Login with Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Login with Facebook</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Login with Twitter</button>
      </nav>
    )
  }


  renderInventory(key) {
    var linkState = this.props.linkState;

    return(
      <div className="fish-edit" ref="fishForm" onSubmit={this.createFish} key={key}>
      <input type="text" valueLink={linkState("fishes." + key + ".name")}/>
      <input type="text" valueLink={linkState("fishes." + key + ".price")}/>
      <select valueLink={linkState("fishes." + key + ".status")}>
        <option value="available">Fresh!</option>
        <option value="unavailable">Sold Out!</option>
      </select>
      <textarea type="text" valueLink={linkState("fishes." + key + ".desc")}></textarea>
      <input type="text" valueLink={linkState("fishes." + key + ".image")}/>
      <button onClick={this.props.removeFish.bind(null, key)}> Remove Fish</button>
      </div>
    )
  }

  render(){

    let logoutButton = <button onClick={this.logout}>Log Out!</button>

    //first check if they arent logged in
    if(!this.state.uid){
      return(
        <div>{this.renderLogin()}</div>
      )
    }

    //then check if they are the owner
    if(this.state.uid !== this.state.owner)
    {
      return(
        <div><p>
        Sorry, you aren't the owner of this store!
        {logoutButton}
        </p></div>
      )
    }

   return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
};

  Inventory.propTypes = {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
  }

export default Inventory;
