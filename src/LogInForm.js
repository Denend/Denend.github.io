import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {loginUs} from './queries/queries';
import CompErrorPopUp from './CompErrorPopUp';

class LogInForm extends Component{
  constructor(props){
    super(props);
    this.errSpan = React.createRef();
    this.child = React.createRef();
    this.state = {
      email: "",
      password: "",
      error: false,
    }
  }

  validateMail = (e) => {
    let re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    let inputMail = document.getElementById("inputEmail");
    if(inputMail.value === '' || !re.test(inputMail.value)){
      this.errSpan.current.style.visibility = "visible";
      inputMail.style.borderColor = "red";
      this.errSpan.current.innerHTML = "Email is incorrect"
    } else {
        inputMail.style.borderColor = "#5ED50F";
        return true;
      }
  }

  validatePass = (e) => {
    let inputPass = document.getElementById("inputPass");
    if (inputPass.value.length < 6) {
      this.errSpan.current.style.visibility = "visible";
      inputPass.style.borderColor = "red"
      this.errSpan.current.innerHTML = "Password has to posess 6 or more symbols";
    } else {
      inputPass.style.borderColor = "#5ED50F";
      return true
    }
  }

  sendLogin = (e) => {
    e.preventDefault()
    if(this.validateMail()
    && this.validatePass()){

      this.setState({error:false})
      this.props.loginDamnUser({
        variables: {
          email: this.state.email,
          password: this.state.password
        }
      }).catch(err => {
          this.setState({error:true})
          this.errSpan.current.style.visibility = "hidden";
          this.child.current.handleOpen(err)
         }).then(res => {
            if(!this.state.error && res.data){
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
        <CompErrorPopUp ref = {this.child}/>
        <br/>
        <form className = 'SignUpForm' onSubmit = {this.sendLogin}>
          <div>
            <input id = "inputEmail" placeholder = "Enter your email" type='email' onChange = {(e) => this.setState({email: e.target.value})} onMouseOut = {this.validatePass}></input>
            <br/>
            <input id = "inputPass"placeholder = "Enter your password"type='password' onChange = {(e) => this.setState({password: e.target.value})} onMouseOut = {this.validateMail}></input>
            <br/>
            <button id = 'submitLoginForm' >Submit</button><p>Dont have an account?</p><a href = "/Signup">Create one</a>  <span id = 'errorSpan' ref = {this.errSpan}>Here is a span</span>
          </div>
        </form>
      </div>
    )
  }
}
export default  graphql (loginUs, {name: 'loginDamnUser'})(LogInForm);
