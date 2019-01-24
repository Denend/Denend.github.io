import React, { Component } from 'react';
import './App.css';
import NavbarComp from './NavbarComp';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import LogInForm from './LogInForm';


const client = new ApolloClient({
  uri: "https://whopping-parched-xoloitzcuintli.gigalixirapp.com/"
});
class LogInFormApollo extends Component {
  render(){
    return(
      <ApolloProvider client ={client}>
        <div>
          <NavbarComp/>
          <LogInForm history={this.props.history} />
        </div>
      </ApolloProvider>
    )
  }
}
export default LogInFormApollo;
