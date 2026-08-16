
import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBookOpen,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";

import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Signup() {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [timer, setTimer] = useState(30);
const [canResend, setCanResend] = useState(false);


const [name, setName] = useState("");
const [email, setEmail] = useState("");

const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] =
  useState(false);

const [password, setPassword] =
  useState("");

const [confirmPassword,
       setConfirmPassword] =
  useState("");

const [loading, setLoading] =
  useState(false);

  const gotoLogin = () => {
    navigate("/Login");
  };

const sendOTP = async () => {
  if (!acceptedTerms) {
    alert("Please accept Terms & Conditions");
    return;
  }

  if (!email) {
    alert("Please enter email");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "https://nextgenprogrammers.onrender.com/send-signup-otp",
      { email }
    );

    console.log(res.data);

    // OTP successfully send hone ke baad hi
    setOtpSent(true);
    setCanResend(false);
    setTimer(30);

    alert("OTP Sent Successfully");
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Failed to send OTP"
    );
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  let interval;

  if (otpSent && !canResend) {
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [otpSent, canResend]);

  const verifyOTP =
    async () => {
      if (!otp) {
        alert(
          "Enter OTP"
        );
        return;
      }

      try {
        const res =
          await axios.post(
            "https://nextgenprogrammers.onrender.com/verify-signup-otp",
            {
              email,
              otp,
            }
          );

        if (
          res.data.verified
        ) {
          setOtpVerified(
            true
          );

          alert(
            "OTP Verified Successfully"
          );
        } else {
          alert(
            "Invalid OTP"
          );
        }
      } catch (error) {
        console.log(
          error
        );

        alert(
          "OTP Verification Failed"
        );
      }
    };

  const handleSignup =
    async (event) => {
      event.preventDefault();

      if (
        password !==
        confirmPassword
      ) {
        alert(
          "Passwords do not match"
        );
        return;
      }

      if (
        !otpVerified
      ) {
        alert(
          "Please verify OTP first"
        );
        return;
      }

      try {
        const response =
          await axios.post(
            "https://nextgenprogrammers.onrender.com/Signup",
            {
              name,
              email,
              password,
            }
          );

        if (
          response.data
            .message ===
          "success"
        ) {
          sessionStorage.setItem(
            "role",
            "user"
          );

          sessionStorage.setItem(
            "name",
            name
          );

          sessionStorage.setItem(
            "email",
            email
          );

          sessionStorage.setItem(
            "userId",
            response
              .data
              .userId
          );

          alert(
            "Signup Successful"
          );

          navigate(
            "/Login"
          );
        }
      } catch (error) {
        if (
          error.response
            ?.data
            ?.message ===
          "email_exists"
        ) {
          alert(
            "Email already registered"
          );
        } else {
          alert(
            "Signup Failed"
          );
        }
      }
    };

  return (


<>
  <Navbar />
  <ScrollToTop />

  <div className="signup-page">
    <div className="signup-main-content">

      <div className="signup-left-section">
        <h2>
          Join NextGen Programmers
        </h2>

        <p>
          Create an account and start learning
        </p>

        <div className="signup-card-illustration">
          <div className="signup-card">
            <div className="signup-circle"></div>
            <div className="signup-line"></div>
            <div className="signup-line signup-small"></div>
          </div>

          <div className="signup-plus-btn">
            +
          </div>
        </div>

        <div className="signup-features">
          <div className="signup-feature">
            <FaBookOpen />
            <span>
              Access to all courses
            </span>
          </div>

          <div className="signup-feature">
            <FaChartLine />
            <span>
              Track your progress
            </span>
          </div>

          <div className="signup-feature">
            <FaTrophy />
            <span>
              Get certified
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={
          handleSignup
        }
      >
       
<div
  className={`signup-form-container ${
    otpSent ? "otp-open" : "otp-closed"
  }`}
>

          <h3>
            Sign Up
          </h3>

          <p>
            Create your account to get started
          </p>

          <label>Full Name</label>

<div className="signup-input-box">
  <FaUser />
  <input
  type="text"
  value={name}
  disabled={otpVerified}
  onChange={(e) =>
    setName(e.target.value)
  }
  placeholder="Enter your name"
  required
/>
</div>

<label>Email Address</label>

<div className="signup-input-box">
  <FaEnvelope />
  <input
  type="email"
  value={email}
  disabled={otpVerified}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  placeholder="Enter email"
  required
/>
</div>
<div className="signup-checkbox">
  <input
    type="checkbox"
    checked={acceptedTerms}
    onChange={(e) =>
      setAcceptedTerms(e.target.checked)
    }
  />

  <span>
    I agree to the Terms &
    Conditions
  </span>
</div>

{!otpVerified && (
  <button
    type="button"
    className="signup-submit-btn"
    onClick={sendOTP}
    disabled={
      loading ||
      !acceptedTerms ||
      (otpSent && !canResend)
    }
  >
    {loading
      ? "Sending..."
      : otpSent
      ? canResend
        ? "Resend OTP"
        : `Resend OTP (${timer}s)`
      : "Send OTP"}
  </button>
)}

  {otpSent && !otpVerified && (
  <div className="otp-wrapper">

    <div className="signup-input-box otp-input-box">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        type="button"
        className="otp-verify-inline"
        onClick={verifyOTP}
        disabled={otp.length !== 6}
      >
        Verify
      </button>
    </div>

    

  </div>
)}





{otpVerified && (
  <>
    <label>Create Password</label>

    <div className="signup-input-box">
      <FaLock />
     <input
  type="password"
  required
  value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        placeholder="Create password"
      />
    </div>

    <label>
      Confirm Password
    </label>

    <div className="signup-input-box">
      <FaLock />
      <input
  type="password"
  required
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value
          )
        }
        placeholder="Confirm password"
      />
    </div>

        
         
    <button
      type="submit"
      className="signup-submit-btn"
    >
      Create Account
    </button>
  </>
)}    

          <p className="signup-signin-text">
            Already have an account?

            <span
              onClick={
                gotoLogin
              }
            >
              Login
            </span>
          </p>

        </div>
      </form>

    </div>
  </div>
</>

  );
}

export default Signup;

