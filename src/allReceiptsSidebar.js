import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {showAllReceipts} from './queries/queries';

class SideBar extends Component {

  showAllTitles=()=>{
    this.props.showReceipts().then(res=> {
      console.log(res.data)
    });
  }

  constructor(props){
    super(props);
    this.state = {
      sortChecked:false
    }
  }

  sortData=(dataToSort)=>{
    return dataToSort.sort((a,b)=>{
      return new Date(b.date) - new Date(a.date);
    })
  };


  displayReceipts=(e)=>{
    let myData = !this.state.sortChecked?this.props.showReceipts.ListCurrentUserReceipts:this.sortData(this.props.showReceipts.ListCurrentUserReceipts);
    if(this.props.showReceipts.loading){
      return (<div>Loading receipts...</div>)
    } else if(myData){
          let totalExp = 0;
          let monthsExp = 0;
          let d = new Date();
          d.setMonth(d.getMonth()-1)
          myData.forEach(e=>{
            totalExp = e.price+totalExp;
            if(new Date(e.date)>d){
              monthsExp = e.price + monthsExp;
            }

          })
          document.getElementById("expences").innerHTML= "Overall you spent "+ totalExp;
          document.getElementById("monthExp").innerHTML= "This month you spent "+ monthsExp;
          return myData.map((e,index)=>{
          return <li value={index} key={index} onClick = {this.displayClickedRes}>{e.itemName}</li>
        })
    } else {
        alert("You are not logged in")
        this.props.history.push("/Login")
    }
  }
  displayClickedRes=(ev)=>{
    const data = this.props.showReceipts.ListCurrentUserReceipts

    document.getElementById("receiptDetails").style.visibility = "visible";
    document.getElementById("Rprice").innerHTML = data[ev.target.value].price
    document.getElementById("Rdescription").innerHTML = data[ev.target.value].description
    document.getElementById("receiptPict").src = data[ev.target.value].imageUrl
    document.getElementById("Rdate").innerHTML = data[ev.target.value].date
    document.getElementById("itemName").innerHTML = "You bought " + data[ev.target.value].itemName

  }
  closeDescription=()=>{
    document.getElementById("receiptDetails").style.visibility = "hidden"
    let myData = this.props.showReceipts.ListCurrentUserReceipts;
    const sortedData = myData.sort((a,b)=>{
      return new Date(b.date) - new Date(a.date);
    })
    console.log(sortedData)
  }
// .then(this.setState({loadingOfReceipts:true}));
  checkSorting=(e)=>{
    console.log(e.target.checked)
    this.setState({sortChecked:e.target.checked});
    e.target.disabled=true;
  }


  render(){

    return(
      <div>
          <div id="allReceiptsComp">
            <div id="receiptDetails">
              <h2 id="itemName">Second div</h2>
              <div id="expInfo">
                <p id="expences">Your overall expences</p>
                <p id="monthExp">Your month expences</p>
              </div>
              <div id = 'wholeReceiptsInfo'>
                <h4>Price</h4>
                  <span id="Rprice">..</span>
                <h4>Description</h4>
                <span id="Rdescription">..</span>
                <h4>Looks like</h4>
                  <div id="imgContainer">
                    <img id = "receiptPict" src="https://tse3.mm.bing.net/th?id=OIP.ovbhqiA_tvBo8XWz6adbugHaHa&pid=Api&w=348&h=348&rs=1&p=0" alt="receipt"></img>
                  </div>
                <h4>Purchased</h4>
                <span id="Rdate"></span>
                <br/>
                <button id="ClosedDescription" onClick={this.closeDescription}>Close</button>
              </div>
          </div>
            <div id="sidebar">
              <h2>Your receipts:</h2>
              <div id="checkBoxContainer">
                <input id="sort" type="checkbox" onChange={this.checkSorting}></input><label htmlFor="sort">Sort by date</label>
              </div>
              <ul id = "allReceipts">
                {this.displayReceipts()};
              </ul>
            </div>
          </div>
      </div>
    )
  }
}

export default graphql (showAllReceipts, {name: "showReceipts"})(SideBar);
