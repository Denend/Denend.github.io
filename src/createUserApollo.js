import React, { Component } from 'react';
import './App.css';
import MyNav from './navbar';
import CreateUser from './createUser';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';



const client = new ApolloClient({
  uri: "https://whopping-parched-xoloitzcuintli.gigalixirapp.com/"
});
class CreateUserApollo extends Component {


  render() {
    return (
      <ApolloProvider client = {client}>
        <div className="App">
          <MyNav/>
          <h2>Registration form</h2>
          <br/>
          <CreateUser history = {this.props.history}/>
        </div>
      </ApolloProvider>
    );
  }
}

export default CreateUserApollo;
