import React, { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import axios from "axios";

export default function Login() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const[email,setEmail] = useState('');
  const password = useRef();
  const [otp, setOtp] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    await loginCall(
      { email: email, password: password.current.value },
      dispatch
    );
  };

  const handleButtonClick = () => {
    navigate("/register");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/verify-otp", {
        email: email,
        otp: otp,
      });
      console.log(res.data);
      // alert(res.data);
      window.location.reload();
    } catch (error) {
      // alert(error);
      console.log(error);
    }
  };

  console.log(otp);
  console.log(email);

  console.log("Login = " + JSON.stringify(user));

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h1 className="loginLogo">fakebook</h1>
          <span className="loginDesc">
            Connecting with your friends, family and people you know.
          </span>
        </div>
        <div className="loginRight">
          {error && (
            <Alert className="rg-alert" severity="error">
              {error.response.data.error}
            </Alert>
          )}

          {error?.response?.data?.otpSent ? (
            <form
              className="loginBox"
              onSubmit={handleVerify}
              style={{ height: "250px" }}
            >
              <h4>Enter the code from your email</h4>
              <hr />
              <p style={{ color: "gray" }}>
                Let us know that this email address belongs to you. Enter the
                code from the email sent to {email}.
              </p>
              <input
                type="text"
                className="loginInput"
                placeholder="Enter your OTP here"
                onChange={(e) => setOtp(e.target.value)}
                required
                minLength={6}
              />
              <button className="loginButton" type="submit">
                Verify
              </button>
            </form>
          ) : (
            <form className="loginBox" onSubmit={handleClick}>
              <input
                type="email"
                className="loginInput"
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="loginInput"
                placeholder="Password"
                ref={password}
                required
                minLength={6}
              />
              <button className="loginButton" disabled={isFetching}>
                {isFetching ? (
                  <CircularProgress color="inherit" size={"35px"} />
                ) : (
                  "Log in"
                )}
              </button>
              <span className="forgotpassword">Forgotten password ?</span>
              <hr />
              <button
                className="createButton"
                disabled={isFetching}
                onClick={handleButtonClick}
              >
                {isFetching ? (
                  <CircularProgress color="inherit" size={"35px"} />
                ) : (
                  "Create new Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
