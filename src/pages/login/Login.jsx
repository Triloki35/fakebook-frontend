import React, { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  const handleClick = async (e) => {
    e.preventDefault();
    await loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  const handleButtonClick = () => {
    navigate("/register");
  }

  // console.log(
  //   `isFetching = ${isFetching} \n error = ${error} \n user = ${user}`
  // );

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
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="email"
              className="loginInput"
              placeholder="Email"
              ref={email}
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
        </div>
      </div>
    </div>
  );
}
