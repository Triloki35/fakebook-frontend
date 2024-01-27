import React, { useEffect, useState } from "react";
import "./recover.css";
import axios from "axios";
import { Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Recover = () => {
  const API = process.env.REACT_APP_API;
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [verified, setVerified] = useState(false);
  const [password,setPassword] = useState("");
  const [matchPassword,setMatchPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirect]);

  const sendOtp = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${API}auth/resend-otp`, { email: email });
      console.log(res.data);
      setMessage(res.data.message);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${API}auth/verify-otp`, {
        email: email,
        otp: otp,
      });
      // const res = await axios.post(`http://localhost:8000/api/auth/verify-otp`, {
      //   email: email,
      //   otp: otp,
      // });
      console.log(res.data);
      setMessage(res.data.message);
      setVerified(true);
      //   navigate("/login");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
    setLoading(false);
  };

  const changePassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (matchPassword !== password) {
        alert("Password doesn't match");
    }else{
        try {
            const res = await axios.put(`${API}users/change-password`,{email:email,password:password});
            console.log(res.data);
            setMessage(res.data.message);
            setRedirect(true);
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
        }
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (success && verified) {
      return (
        <form
          className="loginBox recoverForm"
          style={{ height: "240px" }}
          onSubmit={changePassword}
        >
          <h3>Set Your New Password</h3>
          <input
            required
            minLength={6}
            type="password"
            className="registerInput"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <input
            required
            type="password"
            className="registerInput"
            placeholder="Repeat Password"
            onChange={(e) => setMatchPassword(e.target.value)}
          />

          <button className="registerButton" type="submit">
            {loading ? (
              <CircularProgress color="inherit" size={"35px"} />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      );
    } else if (success) {
      return (
        <form
          className="loginBox recoverForm"
          style={{ height: "240px" }}
          onSubmit={handleVerify}
        >
          <div className="recover-title">
            <h3>Enter the code from your email</h3>
            <hr />
            <p>
              Let us know that this email address belongs to you <b>{email}</b>
            </p>
          </div>
          <input
            required
            type="text"
            className="registerInput"
            placeholder="Enter OTP send to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <p className="send-again" onClick={sendOtp}>
            Send Email Again
          </p>

          <button className="registerButton" type="submit">
            {loading ? (
              <CircularProgress color="inherit" size={"35px"} />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      );
    } else {
      return (
        <form className="loginBox recoverForm" onSubmit={sendOtp}>
          <div className="recover-title">
            <h3>Change Your Account Password</h3>
            <hr />
            <p>Please enter your email address to get otp for your account.</p>
          </div>
          <input
            type="email"
            className="loginInput"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="loginButton rc-otp-btn" disabled={loading}>
            {loading ? (
              <CircularProgress color="inherit" size={"35px"} />
            ) : (
              "GET OTP"
            )}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="recoverContainer">
      {message && (
        <Alert
          className="recover-alert"
          severity="success"
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      )}
      {error && (
        <Alert
          className="recover-alert"
          severity="error"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      {renderContent()}
    </div>
  );
};

export default Recover;
