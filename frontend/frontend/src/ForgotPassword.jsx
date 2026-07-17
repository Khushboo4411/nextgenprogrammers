
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {

    if (!email) {
      alert("Please enter email");
      return;
    }

    try {

      setLoading(true);

      await axios.post(
        "https://nextgenprogrammers.onrender.com/send-forgot-otp",
        { email }
      );

      setOtpSent(true);

      alert("OTP Sent Successfully");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {

      const res = await axios.post(
        "https://nextgenprogrammers.onrender.com/verify-forgot-otp",
        {
          email,
          otp
        }
      );

      if (res.data.verified) {

        setVerified(true);

        alert("OTP Verified Successfully");

      } else {

        alert("Invalid OTP");

      }

    } catch (error) {

      console.log(error);

      alert("Invalid OTP");
    }
  };

  const resetPassword = async () => {

    if (!newPassword) {
      alert("Please enter new password");
      return;
    }

    try {

      await axios.post(
        "https://nextgenprogrammers.onrender.com/reset-password",
        {
          email,
          newPassword
        }
      );

      alert("Password Updated Successfully");

      navigate("/Login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Password Reset Failed"
      );
    }
  };

  return (

    <div className="forgot-page">

      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p className="forgot-subtitle">
          Reset your account password
        </p>

        {/* EMAIL */}

        <input
          className="forgot-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          disabled={otpSent}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {!otpSent && (

          <button
            className="forgot-btn"
            onClick={sendOTP}
            disabled={loading}
          >
            {
              loading
                ? "Sending..."
                : "Send OTP"
            }
          </button>
        )}

        {/* OTP */}

        {otpSent && !verified && (

          <>
            <input
              className="forgot-input"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <button
              className="forgot-btn verify-btn"
              onClick={verifyOTP}
            >
              Verify OTP
            </button>
          </>
        )}

        {/* NEW PASSWORD */}

        {verified && (

          <>
            <input
              className="forgot-input"
              type="password"
              placeholder="Enter new password"
              autoComplete="off" 
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              className="forgot-btn reset-btn"
              onClick={resetPassword}
            >
              Reset Password
            </button>
          </>
        )}

        <div className="back-login">
          Remember password?{" "}
          <span
            onClick={() =>
              navigate("/Login")
            }
          >
            Login
          </span>
        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;

