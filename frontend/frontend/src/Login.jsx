import React from "react";
import "./Login.css";
import axios from 'axios';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import  {useState} from 'react'
import ScrollToTop from "./ScrollToTop";




import {
  FaEnvelope,
  FaLock,

  FaBookOpen,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";

import { IoEyeOffOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";


function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleclick = async (event) => {
        event.preventDefault();

    try {
        const response = await axios.post(
            "https://nextgenprogrammers.onrender.com/login",
            {
                email,
                password
            }
        );

        const message = response?.data?.message;

          if (message === "success") {

            alert("Login Success!");

            localStorage.setItem(
              "token",
              response.data.token
            );

            sessionStorage.setItem(
              "userId",
              response.data.userId
            );

            sessionStorage.setItem(
              "role",
              response.data.role
            );

            sessionStorage.setItem(
              "name",
              response.data.name
            );

            sessionStorage.setItem(
              "email",
              response.data.email
            );
            sessionStorage.setItem(
  "profileImage",
  response.data.profileImage || ""
);

          if (response.data.role === "admin") {
            navigate("/Admin/Dashboard", { replace: true });
          } else {
            navigate("/User/Dashboard", { replace: true });
          }
        } else {
          alert("Login failed");
        }
        console.log(response.data);
      

    } catch (error) {

        if (error.response) {

            const { status, data } = error.response;

            if (
                status === 404 &&
                data?.message === "not_found"
            ) {
                alert("Email not found.");
            }

            else if (
                status === 401 &&
                data?.message === "incorrect"
            ) {
                alert("Password incorrect.");
            }

            else if (
                status === 400 &&
                data?.message === "missing_fields"
            ) {
                alert("Please enter email and password.");
            }

            else {
                alert(
                    "Login failed. " +
                    (data?.message || "Please try again.")
                );
            }

        } else {
            console.error(error);
            alert("Unable to Login. Please try again");
        }
      }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

   
    const gotoSignup=()=>{
      navigate('/Signup');
    }
      
       
       
  return (
    
    <>
    <Navbar />
          <ScrollToTop/>

    <div className="login-page">
      

      {/* Main Section */}
      <div className="login-container">
        {/* Left Side */}
        <div className="login-left-section">
          <h1>Welcome Back!</h1>

          <p>
            Login to continue your learning journey
          </p>

          <div className="login-illustration">
            <FaUserGraduate className="login-student-icon" />
          </div>

          <div className="login-features">
            <div className="login-feature-item">
              <FaBookOpen />
              <span>Access to all courses</span>
            </div>

            <div className="login-feature-item">
              <FaChartLine />
              <span>Track your progress</span>
            </div>

            <div className="login-feature-item">
              <FaTrophy />
              <span>Get certified</span>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="login-card">
          <h2>Login</h2>

          <p className="login-subtitle">
            Enter your credentials to access your account
          </p>

          <div className="login-input-group">
            <label>Email Address</label>

            <div className="login-input-box">
              <FaEnvelope className="login-input-icon" />

              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleEmailChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Password</label>

            <div className="login-input-box">
              <FaLock className="login-input-icon" />

              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />

              <IoEyeOffOutline className="login-eye-icon" />
            </div>
          </div>

         <div className="login-forgot-password">
  <span
    onClick={() => navigate("/ForgotPassword")}
  >
    Forgot Password?
  </span>
</div>

          <button className="login-submit-btn" onClick={handleclick}>
            Login 
          </button>
          <p className="login-bottom-signup">
            New here? <span onClick={gotoSignup}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
    </>
  );


};

export default Login;