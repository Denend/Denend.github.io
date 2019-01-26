import React, {Component} from 'react';
import "./App.css";

class NavbarComp extends Component{
  foo = () => {
    let currUrl = window.location.href
    let index = currUrl.lastIndexOf("/") + 1
    let urlCut = currUrl.substr(index)
    const liArray = document.getElementsByClassName("navBar")[0].children
    if(urlCut === ""){
      liArray[0].children[0].style.color = "yellow";
    } else if(urlCut === "MyReceipts"){
      liArray[1].children[0].style.color = "yellow";
    } else if(urlCut === "Signup"){
      liArray[2].children[0].style.color = "yellow";
    } else if(urlCut === "login"){
      liArray[3].children[0].style.color = "yellow";
    }
  }
  componentDidMount(){
    this.foo()
  }
  render(){
    return(
        <nav >
        <h2>ReceiptsPro</h2>
        <ul className = "navBar">
          <li><a href = "/">Main</a></li>
          <li><a href = "/MyReceipts">My receipts</a></li>
          <li><a href = "/Signup">Sign up</a></li>
          <li id = "lastBarLi"><a href = "/login">Login</a></li>
        </ul>
        </nav>
    );
  }
}

export default NavbarComp;
