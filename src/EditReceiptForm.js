import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {editReceiptMutation} from './queries/queries';


class EditReceiptForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      updateComp:0,
      itemName: this.props.passedData[this.props.activeLi].itemName,
      price:  this.props.passedData[this.props.activeLi].price,
      description:  this.props.passedData[this.props.activeLi].description,
      openDetails:0,
      editError:false,

    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.activeLi !== "") {
      this.setState({ itemName: nextProps.passedData[nextProps.activeLi].itemName,
                      price:nextProps.passedData[nextProps.activeLi].price,
                      description:nextProps.passedData[nextProps.activeLi].description})
    }
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.activeLi!==this.props.activeLi){
      this.setState({editError:false})
    }
  }
  validateIname=(e)=>{
    let inputName = document.getElementById("EdINamefield");
    let errorSpan = document.getElementById("EderrorSpan");
    if (inputName.value.length < 2) {
      errorSpan.style.visibility = 'visible';
      inputName.style.borderColor = "red"
      errorSpan.innerHTML = "Has to be at least two letters";
    } else{
      inputName.style.borderColor = "#5ED50F";
      return true
    }
  }
  validateIprice=(e)=>{
    let inputPrice = document.getElementById("EdPricefield");
    let errorSpan = document.getElementById("EderrorSpan");
    if(!/^[0-9]+$/.test(inputPrice.value)){
      errorSpan.style.visibility = 'visible';
      inputPrice.style.borderColor = "red"
      errorSpan.innerHTML = "Price should contain only numeric characters";
    } else{
      inputPrice.style.borderColor = "#5ED50F";
      return true
    }
  }

  submitEditForm = (e) =>{
    const today = new Date();
    const myDate = today.toISOString().substring(0, 10);
    e.preventDefault();
    if(this.validateIname()===true&&this.validateIprice()===true){
      this.props.updateReceipt({
        variables: {
          date:myDate,
          description:this.state.description,
          item_name: this.state.itemName,
          cost: parseInt(this.state.price),
          uuid: this.props.passedData[this.props.activeLi].uuid,
          submitReceiptDone: false,
        }
      }).catch(err=>{
        this.setState({editError:true})
        alert("Thats likely not your receipt ..." + err)
      }).then(res=>{
        if(!this.state.editError){
          window.location.reload()
        }
        //console.log(res)
      })


    }
  }
  changeBar=()=>{
    this.setState({openDetails:!this.state.openDetails})
    this.props.callback(!this.state.openDetails)
  }

  render(){
    return(
      <div>
        <div id="editReceiptComp">
          <button onClick={(e)=>{this.changeBar()}}>Back</button>
          <form id="EditReceipt" onSubmit = {this.submitEditForm}>
            <div>
              <label >Edit Name</label>
              <input  value={this.state.itemName}id="EdINamefield" type="text" onMouseOut = {this.validateIname} onChange = {(e) => this.setState({itemName: e.target.value})}/>
            </div>
            <div>
              <label >Edit price</label>
              <input value={this.state.price} id="EdPricefield" type="text"  onMouseOut = {this.validateIprice} onChange = {(e) => this.setState({price: e.target.value})}/>
            </div>
            <div>
              <label className="field">Edit description</label>
              <input value={this.state.description} id="EdDescfield" type="text" onChange = {(e) => this.setState({description: e.target.value})}/>
            </div>
              <span id="EderrorSpan">There is a mistake</span>
            <br/>
            <button>Edit this receipt</button>
          </form>
        </div>
      </div>
    )
  }
}
export default graphql(editReceiptMutation, {name:"updateReceipt"})(EditReceiptForm)
