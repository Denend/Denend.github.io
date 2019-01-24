import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {loginUs} from './queries/queries';




class LogInForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      error:false,
    }
  }

  validateMail=(e)=>{
    let re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    let inputMail = document.getElementById("inputEmail");
    let errorSpan = document.getElementById("errorSpan");
    if(inputMail.value==='' || !re.test(inputMail.value)){
      errorSpan.style.visibility = "visible";
      inputMail.style.borderColor = "red";
      errorSpan.innerHTML = "Email is incorrect"
    }else{
        inputMail.style.borderColor = "#5ED50F";
        return true;
      }
  }

  validatePass=(e)=>{
    let inputPass = document.getElementById("inputPass");
    let errorSpan = document.getElementById("errorSpan");
    if (inputPass.value.length < 6) {
      errorSpan.style.visibility = "visible";
      inputPass.style.borderColor = "red"
      errorSpan.innerHTML = "Password has to posess 6 or more symbols";
    } else {
      inputPass.style.borderColor = "#5ED50F";
      return true
    }
  }
  sendLogin = (e) => {
    let errorSpan = document.getElementById("errorSpan");
    e.preventDefault()
    if(this.validateMail() && this.validatePass()){

      this.setState({error:false})
      this.props.loginDamnUser({
        variables: {
          email: this.state.email,
          password: this.state.password
        }
      }).catch(err => {
          alert(err)
          this.setState({error:true})
          errorSpan.innerHTML = "Login or password is incorrect"
         }).then(res => {
            //console.log(res.data.loginUser.accessToken)
            if(!this.state.error && res.data){
              //console.log(res.data)
              localStorage.setItem('my-jwt', res.data.loginUser.accessToken)
              this.props.history.push('/MyReceipts')
            }
          }
      );
    }
  }
  render() {
    return(
      <div>
        <br/>
        <form className='SignUpForm' onSubmit= {this.sendLogin}>
          <div>
            <input id="inputEmail" placeholder = "Enter your email" type='email' onChange = {(e) => this.setState({email: e.target.value})} onMouseOut = {this.validatePass}></input>
            <br/>
            <input id="inputPass"placeholder = "Enter your password"type='password' onChange = {(e) => this.setState({password: e.target.value})} onMouseOut = {this.validateMail}></input>
            <br/>
            <button id='submitLoginForm' >Submit</button><p>Dont have an account?</p><a href="/Signup">Create one</a>  <span id='errorSpan'>Here is a span</span>
          </div>
        </form>
      </div>
    )
  }
}
export default  graphql (loginUs, {name: 'loginDamnUser'})(LogInForm);
