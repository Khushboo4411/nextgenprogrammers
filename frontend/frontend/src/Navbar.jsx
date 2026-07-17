import React from 'react';
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import {NavLink} from 'react-router-dom';


function Navbar() {
 
  const navigate =useNavigate();
  const gotoLogin=()=>{
    navigate('/Login');
  }
  const gotoCourses=()=>{
    navigate('/Courses');
  }
    
  return (
    <div className='Nav'>
      <nav className="signup-navbar">
        <div className="signup-logo">
          <div className="signup-logo-icon">🎓</div>

          <div>
            <h3>NextGen Programmers</h3>
           
          </div>
        </div>

        <ul className="signup-nav-links">
         
          <NavLink to='/' className='signup-nav-link'>
            Home
          </NavLink>
          <NavLink to='/Courses' className='signup-nav-link'>
            Courses
          </NavLink>
          <NavLink to='/About' className='signup-nav-link'>
            About
          </NavLink>
          <NavLink to='/WhyChooseUs' className='signup-nav-link'>
            WhyChooseUs
          </NavLink>
          <NavLink to='/Testimonials' className='signup-nav-link'>
            Testimonials
          </NavLink>
          <NavLink to='/Contact' className='signup-nav-link'>
            Contact
          </NavLink>

           


        </ul>

        <div className="signup-nav-buttons">
          <button className="signup-login-btn" onClick={gotoLogin}> 
            SignUp / Login
          </button>

          <button className="signup-enroll-btn" onClick={gotoCourses}>
            Enroll Now 
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
