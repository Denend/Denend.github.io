import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import './App.css';
import {submitCCodeMutation} from './queries/queries';
class ConfirmationPopUp extends Component {
  constructor(props){
    super(props);
    this.state={
      code: "",
      error:false
    }
  }
  validateCode=(e)=>{
    let inputCode = document.getElementById("inputCCode");
    if(inputCode.value<6){
      inputCode.style.borderColor = "red"
    } else {
      inputCode.style.borderColor = "#5ED50F";
      return true;
    }
  }
  sendCode=(e)=>{
    this.setState({error:false})
    e.preventDefault();
    if(this.validateCode()){
      this.props.submitMutation({
        variables: {
          email: this.props.emailForCCode,
          confirmationCode: this.state.code,
        }
      }).catch(err=>{
          alert(err)
          this.setState({error:true})
      }).then(res=>{
        if(!this.state.error){
          this.props.history.push("/Login");
        }
      });
    }
  }
  render(){
    return(
      <div>
        <form className='ConfirmForm' onSubmit= {this.sendCode}>
          <div>
            <span>Massage with a confirmation code was sent to your e-mail</span>
            <br/>
            <input id="inputCCode"placeholder = "Enter your confirmation code" type='text' onChange = {(e) => this.setState({code: e.target.value})} onMouseOut = {this.validateCode}></input>
            <br/>
            <button id='submitCodeForm' >Submit</button>
          </div>
        </form>
      </div>
    )

  }
}
export default graphql (submitCCodeMutation,{name:'submitMutation'})(ConfirmationPopUp);
