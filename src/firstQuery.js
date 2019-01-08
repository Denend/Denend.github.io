import React, {Component} from 'react';
// import { Query } from 'react-apollo';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';

//если шо попробовать еще раз как было до этого
const getReceiptsQuery = gql`
  {
    getReceipt(uuid:"gmgm"){
      date
    }
  }
   `
class TestQuery extends Component {
  displayReceipts(){
    let data = this.props.data;
    if(data.loading){
      return (<div>Loading recepts...</div>)
    } else {
      data.description.map(e=>{
        return <li>{e}</li>
      })
    }
  }
  render(){
    return(
       console.log(this.props),
      <div>
        <h2>Its a sucess</h2>
        <ul>here is gonna be a foo</ul>

      </div>

      // <Query query={gql`
      //     getReceipt:Receipt {
      //       date
      //     }
      //   `}>

        // {({loading, error, data})=> {
        //   if(loading) return <p>Loading</p>
        //   if(error) return <p>Error...</p>
        //
        //   return <div>{data.getReceipt.date}</div>
        // }}
      // </Query>


    );
  }
}

export default graphql (getReceiptsQuery)(TestQuery);
