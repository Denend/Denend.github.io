import React, {Component} from 'react';
import './App.css';
import MyNav from './navbar'
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import CreateR from './addReceipt';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';


const initUri = createHttpLink({ uri: " https://whopping-parched-xoloitzcuintli.gigalixirapp.com/"
});

const authLink = setContext((_,{headers})=>{
  const token = localStorage.getItem('my-jwt');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  }

});

const client = new ApolloClient({
  link: authLink.concat(initUri),
  cache: new InMemoryCache()
});

class ApolloT extends Component {
  render(){
    return(
      <ApolloProvider client = {client}>
        <div>
          <MyNav/>
          <br/>
          <CreateR history={this.props.history}/>
        </div>
      </ApolloProvider>
      );
  }
}


export default ApolloT;
