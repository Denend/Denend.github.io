import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {showAllReceipts} from './queries/queries';
import {deleteThisReceipt} from './queries/queries'
import ReceiptDetailsBar from './ReceiptDetailsBar';
import EditReceiptForm from './EditReceiptForm'

class ReceiptsSidebar extends Component {

  showAllTitles=()=>{
    console.log(this.props)
  }

  constructor(props){
    super(props);
    this.state = {
      sortChecked:false,
      activeReceiptValue:"",
      deleteError:false,
      editReceiptOpen:1,
      reloadAfterAdd:this.props.noReload,
    }
  }
  // componentDidUpdate(prevProps, prevState){
  //   if(prevState.reloadAfterAdd!==this.state.reloadAfterAdd){
  //     this.forceUpdate()
  //   }
  // }
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

          return myData.map((e,index)=>{
          return <li value={index} key={index} onClick = {(e)=>{this.setState({activeReceiptValue:e.target.value})}}>{e.itemName}</li>
        })
    } else {
        alert("You are not logged in")
        this.props.history.push("/Login")
    }
  }

  closeDescription=()=>{
    document.getElementById("receiptDetails").style.visibility = "hidden"
  }
  checkSorting=(e)=>{
    this.setState({sortChecked:e.target.checked});
    e.target.disabled=true;
  }
  callBackDetails=(dataFromDetails)=>{
    this.setState({editReceiptOpen:dataFromDetails})
  }

  render(){
    return(
      <div>
          <div id="allReceiptsComp">
            {this.state.editReceiptOpen?<ReceiptDetailsBar callback = {this.callBackDetails} closeDescExt = {this.closeDescription} DeleteErrExtState = {this.state.deleteError} sidebarProps = {this.props}  activeLi = {this.state.activeReceiptValue} passedData = {this.props.showReceipts.ListCurrentUserReceipts}/>:<EditReceiptForm activeLi = {this.state.activeReceiptValue} passedData = {this.props.showReceipts.ListCurrentUserReceipts} callback = {this.callBackDetails}/>}
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

export default compose (
  graphql(showAllReceipts, {name: "showReceipts"}),
  graphql(deleteThisReceipt, {name:"removeReceipt"})
)(ReceiptsSidebar);
