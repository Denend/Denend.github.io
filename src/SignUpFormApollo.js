import React, { Component } from 'react';
import './App.css';
import NavbarComp from './NavbarComp';
import SignUpForm from './SignUpForm';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';



const client = new ApolloClient({
  uri: "https://whopping-parched-xoloitzcuintli.gigalixirapp.com/"
});
class SignUpFormApollo extends Component {


  render() {
    return (
      <ApolloProvider client = {client}>
        <div className="App">
          <NavbarComp/>
          <h2>Registration form</h2>
          <br/>
          <SignUpForm history = {this.props.history}/>
        </div>
      </ApolloProvider>
    );
  }
}

export default SignUpFormApollo;
