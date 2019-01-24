import React, {Component} from 'react';
import NavbarComp from './NavbarComp';
class MainPage extends Component {
  render(){
    return(
      <div className="mainPageBackground">
        <NavbarComp/>
        <br/>
        <header className='mainHeader'>
          <h1 className="mainHeader">Wellcome to ReceiptsPro</h1>
          <p>App for recording your receipts</p>
          <button id='getStartedButt'><a href="/Signup">Get Started</a></button>
        </header>
        <div id='mainMiddle'>
            <div id="descriptionContainer">
              <h2>ReceiptsPro</h2>
              <p>In order to proceed you should sign up first, by pressing the 'get started button'
                or by clicking 'Sign in' on the navbar, then just log in using you email and password
                after that you will be redirected to a page where you can create and observe receipts;
              </p>
            </div>
          <div id="imgLogoContainer">
            <img src="https://t0.rbxcdn.com/276ff4919adca2f2f3f8c58285446f31" alt="icon"></img>
          </div>
        </div>
      </div>
    )

  }
}
export default MainPage;
