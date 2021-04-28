import React from 'react'
import {NavLink} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'

import logo3 from '../images/foodchain.png'

const Navbar = () => {
    return (
        <>
<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <NavLink className="navbar-brand" to="/">
 
      
       <h4> <img src={logo3} alt="" height="30px" width="35px"/><span>  </span>Food Chain </h4>
       
      </NavLink>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item active">
        <NavLink className="nav-link" to="/"><h6>Home</h6> <span className="sr-only">(current)</span></NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link"to="/post"><h6>Post</h6></NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link"to="/contactus"><h6>Profile</h6></NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link"to="/login"><h6>Login</h6></NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link"to="/register"><h6>Register</h6></NavLink>
      </li>
      
      
      
      
    </ul>
  
  </div>
</nav>
        </>
    )
}

export default Navbar
