//Inventory <Inventory/>

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://my-catch-app.firebaseio.com/');
import base from './App';

// const ref = new Firebase('https://catch-of-the-day-78ad9.firebaseio.com/');
// const ref = new Firebase('https://auth.firebase.com/v2/catchof-the-day/auth/github/callback');


@autobind
class Inventory extends React.Component{

  constructor() {
    super();

    this.state = {
      uid : ''
    }
  }

  authenticate(provider) {
    console.log("Trying to auth with" + provider);
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  componentWillMount() {
    console.log("Checking to see if we can log them in");
    var token = localStorage.getItem('token');
      if(token) {
        ref.authWithCustomToken(token,this.authHandler);
      }
  }

  logout(){
    ref.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null
    });
  }

  authHandler(err, authData) {
    if(err){
      console.error(err);
      //console.log(authData);
      return;
    }

    //save the login token in the browser
    localStorage.setItem('token', authData.token);
    const storeRef = ref.child(this.props.params.storeID);

    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};
      //if no owner claim as owner
      if(!data.owner){
        storeRef.set({
          owner : authData.uid
        });
      }

      //update our state to reflect the current store owner
      this.setState({
        uid : authData.uid,
        owner : data.owner || authData.uid
      });

    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')} >Log In with Facebook</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')} >Log In with Twitter</button>
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

  render() {

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
