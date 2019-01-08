import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import CreateUserApollo from './createUserApollo';
import ApolloT from './ReceiptsApollo';
import LoginApollo from './loginApollo';
import MainPage from './mainPage';
class Routes extends Component {
  render(){
    return(
      <BrowserRouter >
        <Switch>
          <Route path="/" exact component={MainPage}/>
          <Route path="/Signup" exact component={CreateUserApollo}/>
          <Route path="/MyReceipts" exact component={ApolloT}/>
          <Route path="/Login" exact component={LoginApollo}/>
        </Switch>
      </BrowserRouter>

    );
  }
}
export default Routes;
