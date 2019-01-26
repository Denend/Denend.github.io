import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {addReceiptMutation} from './queries/queries';
import ReceiptsSidebar from './ReceiptsSidebar';
import ErrorPopUp from './ErrorPopUp';

class ReceiptCreationForm extends Component {
  constructor(props){
    super(props);
    this.child = React.createRef();
    this.errSpan = React.createRef();
    this.state = {
      itemName: "",
      price: "",
      description: "",
      imageUrl: "",
      createReceiptErr: false,
    };
  };
  validateIname = (e) => {
    let inputName = document.getElementById("INamefield");
    if(inputName.value <2 ){
      this.errSpan.current.style.visibility = 'visible';
      inputName.style.borderColor = "red"
      this.errSpan.current.innerHTML = "Has to be at least two letters";
    } else{
      inputName.style.borderColor = "#5ED50F";
      return true
    }
  }
  validateIprice = (e) => {
    let inputPrice = document.getElementById("Pricefield");
    if(!/^[0-9]+$/.test(inputPrice.value)){
      this.errSpan.current.style.visibility = 'visible';
      inputPrice.style.borderColor = "red"
      this.errSpan.current.innerHTML = "Price should contain only numeric characters";
    } else {
      inputPrice.style.borderColor = "#5ED50F";
      return true
    }
  }

  validateUrl = (e) => {
    let strUrl = new RegExp('^(https?:\\/\\/)?'+
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
  '((\\d{1,3}\\.){3}\\d{1,3}))'+
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
  '(\\?[;&a-z\\d%_.~+=-]*)?'+
  '(\\#[-a-z\\d_]*)?$','i');
    let inputUrl = document.getElementById("Urlfield");
    if(!strUrl.test(inputUrl.value)){
    this.errSpan.current.style.visibility = 'visible';
      inputUrl.style.borderColor = "red"
      this.errSpan.current.innerHTML = "Has to be a URL adress";
    } else{
      inputUrl.style.borderColor = "#5ED50F";
      return true
    }
  }

  getJWT = () => {
    return localStorage.getItem("my-jwt");
  }

  submitReceiptForm = (e) => {
    this.setState({createReceiptErr:false})
    const today = new Date();
    const myDate = today.toISOString().substring(0, 10);
    e.preventDefault();
    if(this.validateIname() && this.validateIprice() && this.validateUrl()){
      this.props.createReceipt({
        variables: {
          date:myDate,
          description:this.state.description,
          imageUrl: this.state.imageUrl,
          item_name: this.state.itemName,
          cost: parseInt(this.state.price),
        }
      }).catch(err => {
          this.child.current.handleOpen(err)
          this.setState({createReceiptErr:true})
      }).then(res => {
          if(!this.state.createReceiptErr)window.location.reload()
         }
    )}
  }
  render() {
    return(
      <div>
        <ErrorPopUp ref={this.child}/>
        <h2 id = "CreateReceiptHeader">Create your receipt</h2>
        <form id = "AddReceipt" onSubmit = {this.submitReceiptForm}>
          <div>
            <label >Enter an item name</label>
            <input id = "INamefield" type = "text" onMouseOut = {this.validateIname} onChange = {(e) => this.setState({itemName: e.target.value})}/>
          </div>
          <div>
            <label >Enter its price</label>
            <input id = "Pricefield" type = "text"  onMouseOut = {this.validateIprice} onChange = {(e) => this.setState({price: e.target.value})}/>
          </div>
          <div>
            <label className="field">Add a description</label>
            <input id = "Descfield" type = "text" onChange = {(e) => this.setState({description: e.target.value})}/>
          </div>
          <div>
            <label className="field">Enter a url of your item</label>
            <input id = "Urlfield" type = "text" onMouseOut = {this.validateUrl} onChange = {(e) => this.setState({imageUrl: e.target.value})}/>
            <span id = "errorSpan" ref={this.errSpan}>There is a mistake</span>
          </div>
          <br/>
          <button>Add a receipt</button>
        </form>
        <ReceiptsSidebar history = {this.props.history} ref = "SideComp"/>
      </div>
    )
  }
}
export default graphql (addReceiptMutation, {name:"createReceipt"})(ReceiptCreationForm);
