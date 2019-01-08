import React, {Component} from 'react';
import "./App.css";

class MyNav extends Component{
  render(){
    return(
        <nav >
        <h2>ReceiptsPro</h2>
        <ul className = "navBar">
          <li><a href = "/">Main</a></li>
          <li><a href = "/MyReceipts">My receipts</a></li>
          <li><a href = "/Signup">Sign up</a></li>
          <li id="lastBarLi"><a href = "/login">Login</a></li>
        </ul>
        </nav>

    );
  }
}

export default MyNav;
