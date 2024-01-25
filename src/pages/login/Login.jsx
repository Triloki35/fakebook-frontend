import React, { useContext, useEffect, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import VerifyEmail from "../register/VerifyEmail";

export default function Login() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const password = useRef();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setErrorMsg(error?.response?.data?.error);
  }, [error]);

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
          {errorMsg && (
            <Alert
              className="rg-alert"
              severity="error"
              onClose={() => setErrorMsg(null)}
            >
              {errorMsg}
            </Alert>
          )}

          {error?.response?.data?.otpSent ? (
            <VerifyEmail email={email} />
          ) : (
            <form className="loginBox" onSubmit={handleClick}>
              <input
                type="email"
                className="loginInput"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
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
              <Link to={"/recover"} className="forgotpassword">
                Forgotten password ?
              </Link>
              <hr />
              <button
                className="createButton"
                disabled={isFetching}
                onClick={handleButtonClick}
              >
                Create new Account
              </button>
            </form>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>
          &copy; 2024 fakebook. All rights reserved. Designed by triloki35
        </p>
      </footer>
    </div>
  );
}
