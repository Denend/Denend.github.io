import React, { Component } from 'react';
import './App.css';
import MyNav from './navbar';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import LoginUser from './loginUserComp';



const client = new ApolloClient({
  uri: "https://whopping-parched-xoloitzcuintli.gigalixirapp.com/"
});
class LoginApollo extends Component {
  render(){
    return(
      <ApolloProvider client ={client}>
        <div>
          <MyNav/>
          <LoginUser history={this.props.history} />
        </div>
      </ApolloProvider>
    )
  }
}
export default LoginApollo;
