import React,{Component} from 'react';
import ErrorPopUp from './ErrorPopUp';


class ReceiptDetailsBar extends Component {
  constructor(props){
    super(props)
    this.child = React.createRef()
    this.state = {
      deleteError: false,
      editReceiptOpen: 1

    }
  }
  componentDidUpdate(prevProps, prevState){
    if(this.props.activeLi !== ""){
      this.displayClickedRes()
    }
    if(prevProps.activeLi !== this.props.activeLi){
      this.setState({deleteError:false})
    }
  }
  componentDidMount(){
    if(this.props.activeLi !== ""){
      this.displayClickedRes()
    }
  }

  calculateExp = () => {
    let myData = this.props.passedData
    let totalExp = 0;
    let monthsExp = 0;
    let d = new Date();
    d.setMonth(d.getMonth() -1 )
    myData.forEach(e => {
      totalExp = e.price + totalExp;
      if(new Date(e.date) > d){
        monthsExp = e.price + monthsExp;
      }
    })
    document.getElementById("expences").innerHTML = "Overall you spent " + totalExp;
    document.getElementById("monthExp").innerHTML = "This month you spent " + monthsExp;
  }

  displayClickedRes = () => {
      const data = this.props.passedData
      let indexLi = this.props.activeLi
      document.getElementById("receiptDetails").style.visibility = "visible";
      document.getElementById("Rprice").innerHTML = data[indexLi].price
      document.getElementById("Rdescription").innerHTML = data[indexLi].description
      document.getElementById("receiptPict").src = data[indexLi].imageUrl
      document.getElementById("Rdate").innerHTML = data[indexLi].date
      document.getElementById("itemName").innerHTML = "You bought " + data[indexLi].itemName
      this.calculateExp()
  }
  deleteCurrentReceipt = () => {
    const data = this.props.passedData
    console.log(data[this.props.activeLi].uuid)
    const clickedElemUuid = data[this.props.activeLi].uuid
    this.props.sidebarProps.removeReceipt({
      variables: {
        uuid:clickedElemUuid
      }
    }).catch( err => {
        this.setState({deleteError: true})
        this.child.current.handleOpen("You did not created this receipt  " + err)
    }).then( res => {
        if(!this.state.deleteError){
          alert("Receipt was deleted")
          this.setState({deleteError: false})
          document.getElementById("allReceipts").children[this.props.activeLi].remove()
          this.props.closeDescExt()
        }
    })
  }

  changeBar = () => {
    this.setState({editReceiptOpen:!this.state.editReceiptOpen})
    this.props.callback(!this.state.editReceiptOpen)
  }

  render(){
    console.log("updated")
    return(
      <div>
        <ErrorPopUp ref = {this.child}/>
        <div id = "receiptDetails">
          <h2 id = "itemName">Second div</h2>
          <div id = "expInfo">
            <p id = "expences">Your overall expences</p>
            <p id = "monthExp">Your month expences</p>
          </div>
          <div id = 'wholeReceiptsInfo'>
            <h4>Price</h4>
            <span id = "Rprice">...</span>
            <h4>Description</h4>
            <span id = "Rdescription">...</span>
            <h4>Looks like</h4>
            <div id = "imgContainer">
              <img id = "receiptPict" src="https://tse3.mm.bing.net/th?id=OIP.ovbhqiA_tvBo8XWz6adbugHaHa&pid=Api&w=348&h=348&rs=1&p=0" alt="receipt"></img>
            </div>
            <h4>Purchased</h4>
            <span id = "Rdate"></span>
            <br/>

                <div id = "deleteImgContainer">
                                <img src = 'data:image/png;base64,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' alt = "delete" onClick = {this.deleteCurrentReceipt}></img>
                                <p id = 'deleteReceiptDesc'>Delete this receipt</p>
                                <div id = "detailsButtons">
                                <button id = "ClosedDescription" onClick = {(e) => this.props.closeDescExt()}>Close</button>
                                <button id = "EditReceiptButton" onClick = {(e) => {this.changeBar()}}>Edit this receipt</button>
                                </div>
                </div>
           </div>
        </div>
     </div>



    )
  }
}

export default ReceiptDetailsBar;
