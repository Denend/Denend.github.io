import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import './App.css';
import {signUpUs} from "./queries/queries";
import ConfirmUs from './confirmUser';

class CreateUser extends Component{
  constructor(props){
    super(props);
    this.state = {
      email:"",
      familyName:"",
      name:"",
      password:"",
      signUpDone: false,
      error:false,
    };
  };

  validateName=(e)=>{
    let errorSpan = document.getElementById("errorSpan");
    let inputName = document.getElementById("inputN");
    if(inputName.value<2){
      errorSpan.style.visibility = 'visible';
      inputName.style.borderColor = "red"
      errorSpan.innerHTML = "Name has to posess 2 or more symbols"
    } else {
      inputName.style.borderColor = "#5ED50F";
      return true;
    }
  }
  validateMail=(e)=>{
    let re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    let inputMail = document.getElementById("inputEmail");
    let errorSpan = document.getElementById("errorSpan");
    if(inputMail.value==='' || !re.test(inputMail.value)){
      errorSpan.style.visibility = 'visible';
      inputMail.style.borderColor = "red";
      errorSpan.innerHTML = "Email is incorrect"
    } else{

        inputMail.style.borderColor = "#5ED50F";
        return true;
      }
  }
  validateFname=(e)=>{
    let inputFname = document.getElementById("inputF");
    let errorSpan = document.getElementById("errorSpan");
    if(inputFname.value<2){
      errorSpan.style.visibility = 'visible';
      inputFname.style.borderColor = "red"
      errorSpan.innerHTML = "Family name has to posess 2 or more symbols"
    } else {
      inputFname.style.borderColor = "#5ED50F";
      return true;
    }
  }

  validatePass=(e)=>{
    let inputPass = document.getElementById("inputPass");
    let errorSpan = document.getElementById("errorSpan");
    if(inputPass.value.length<6){
      errorSpan.style.visibility = 'visible';
      inputPass.style.borderColor = "red"
      errorSpan.innerHTML = "Password has to posess 6 or more symbols";

    } else {
      inputPass.style.borderColor = "#5ED50F";
      return true
    }
  }
  validatePass1=(e)=>{
    let inputPass = document.getElementById("inputPass");
    let inputPass1 = document.getElementById("inputPass1");
    let errorSpan = document.getElementById("errorSpan");
    if(inputPass1.value !== inputPass.value || inputPass1.value === ""){
      errorSpan.style.visibility = 'visible';
      inputPass.style.borderColor = "red"
      inputPass1.style.borderColor = "red"
      errorSpan.innerHTML = "Passwords does not match";
    } else{
      inputPass.style.borderColor = "#5ED50F";
      inputPass1.style.borderColor = "#5ED50F";
      return true
    }
  }
  sendRegistration = (e) => {
    let errorSpan = document.getElementById("errorSpan")
    errorSpan.style.visibility="hidden";
    e.preventDefault();
    if(this.validateName()===true&&this.validateMail()===true&&this.validateFname()===true&&this.validatePass()===true&&this.validatePass1()===true){
      this.props.createDamnUser({
        variables: {
          email: this.state.email,
          familyName: this.state.familyName,
          name:this.state.name,
          password:this.state.password,
        },
      }).catch(err=>
          {
            alert(err)
            this.setState({error:true})
          }).then(
            response=> {
                if(!this.state.error){
                  console.log(response.data.CreateUser.uuid)
                  this.setState({signUpDone:true})
                }
            },
          );
      console.log(this.props);
    }
  }
  CCRender=()=>{
    if(this.state.signUpDone){
      return <ConfirmUs emailForCCode = {this.state.email}/>
    }
  }

  render(){
    return(
      <div>
        <form className='SignUpForm' onSubmit= {this.sendRegistration}>
          <div>
            <input id="inputN"placeholder = "Enter your name" type='text' onChange = {(e) => this.setState({name: e.target.value})} onMouseOut = {this.validateName}></input>
            <br/>
            <input id="inputF"placeholder = "Enter your family name"type='text' onChange = {(e) => this.setState({familyName: e.target.value})} onMouseOut = {this.validateFname}></input>
            <br/>
            <input id="inputEmail"placeholder = "Enter your email"type='email' onChange = {(e) => this.setState({email: e.target.value})} onMouseOut = {this.validateMail}></input>
            <br/>
            <input id="inputPass"placeholder = "Enter your password"type='password' onChange = {(e) => this.setState({password: e.target.value})} onMouseOut = {this.validatePass}></input>
            <br/>
            <input id="inputPass1"placeholder = "Confirm your password"type='password' onChange = {(e) => this.setState({itemName: e.target.value})} onMouseOut = {this.validatePass1}></input>
            <br/>
            <button id='submitSignForm' >Submit</button><p>Already have an account?</p><a href="/Login">Login</a>  <span id='errorSpan'>Something is wrong</span>
          <br/>
          </div>
        </form>
        <div>{this.CCRender()}</div>
      </div>
    )
  }
}
export default graphql (signUpUs, {name: "createDamnUser"})(CreateUser);
