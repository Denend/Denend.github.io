import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import SignUpFormApollo from './SignUpFormApollo';
import ReceiptsApollo from './ReceiptsApollo';
import LogInFormApollo from './LogInFormApollo';
import MainPage from './MainPage';
class Routes extends Component {
  render(){
    return(
      <BrowserRouter >
        <Switch>
          <Route path="/" exact component={MainPage}/>
          <Route path="/Signup" exact component={SignUpFormApollo}/>
          <Route path="/MyReceipts" exact component={ReceiptsApollo}/>
          <Route path="/Login" exact component={LogInFormApollo}/>
        </Switch>
      </BrowserRouter>
    );
  }
}
export default Routes;
