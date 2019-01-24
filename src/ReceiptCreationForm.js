import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {addReceiptMutation} from './queries/queries';
import AllReceiptsSidebar from './AllReceiptsSidebar';




class ReceiptCreationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      itemName: "",
      price: "",
      description: "",
      imageUrl: "",
      submitReceiptDone:0,

    };
  };
  validateIname=(e)=>{
    let inputName = document.getElementById("INamefield");
    let errorSpan = document.getElementById("errorSpan");
    if(inputName.value<2){
      errorSpan.style.visibility = 'visible';
      inputName.style.borderColor = "red"
      errorSpan.innerHTML = "Has to be at least two letters";
    } else{
      inputName.style.borderColor = "#5ED50F";
      return true
    }
  }
  validateIprice=(e)=>{
    let inputPrice = document.getElementById("Pricefield");
    let errorSpan = document.getElementById("errorSpan");
    if(!/^[0-9]+$/.test(inputPrice.value)){
      errorSpan.style.visibility = 'visible';
      inputPrice.style.borderColor = "red"
      errorSpan.innerHTML = "Price should contain only numeric characters";
    } else{
      inputPrice.style.borderColor = "#5ED50F";
      return true
    }
  }

  validateUrl=(e)=>{
    let strUrl = new RegExp('^(https?:\\/\\/)?'+
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
  '((\\d{1,3}\\.){3}\\d{1,3}))'+
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
  '(\\?[;&a-z\\d%_.~+=-]*)?'+
  '(\\#[-a-z\\d_]*)?$','i');
    let inputUrl = document.getElementById("Urlfield");
    let errorSpan = document.getElementById("errorSpan");
    if(!strUrl.test(inputUrl.value)){
      errorSpan.style.visibility = 'visible';
      inputUrl.style.borderColor = "red"
      errorSpan.innerHTML = "Has to be a URL adress";
    } else{
      inputUrl.style.borderColor = "#5ED50F";
      return true
    }
  }

  getJWT=()=>{
    return localStorage.getItem("my-jwt");
  }
  submitReceiptForm = (e) =>{
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
          alert(err);
      }).then(res => {
          //console.log(this.props);
          this.setState({submitReceiptDone:!this.state.submitReceiptDone})
          //console.log(this.props);
          window.location.reload()
         }
    )}
  }
  render() {
    return(
      <div>
        <h2>Create your receipt</h2>
        <form id="AddReceipt" onSubmit = {this.submitReceiptForm}>
          <div>
            <label >Enter an item name</label>
            <input id="INamefield" type="text" onMouseOut = {this.validateIname} onChange = {(e) => this.setState({itemName: e.target.value})}/>
          </div>
          <div>
            <label >Enter its price</label>
            <input id="Pricefield" type="text"  onMouseOut = {this.validateIprice} onChange = {(e) => this.setState({price: e.target.value})}/>
          </div>
          <div>
            <label className="field">Add a description</label>
            <input id="Descfield" type="text" onChange = {(e) => this.setState({description: e.target.value})}/>
          </div>
          <div>
            <label className="field">Enter a url of your item</label>
            <input id="Urlfield" type="text" onMouseOut = {this.validateUrl} onChange = {(e) => this.setState({imageUrl: e.target.value})}/>
            <span id="errorSpan">There is a mistake</span>
          </div>
          <br/>
          <button>Add a receipt</button>
        </form>
        <AllReceiptsSidebar noReload = {this.state.submitReceiptDone} history={this.props.history} ref="SideComp"/>
      </div>
    )
  }
}
export default graphql (addReceiptMutation, {name:"createReceipt"})(ReceiptCreationForm);
