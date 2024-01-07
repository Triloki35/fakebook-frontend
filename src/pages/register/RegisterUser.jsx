import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Alert from "@mui/material/Alert";
import VerifyEmail from "./VerifyEmail";

const RegisterUser = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const matchPassword = useRef();
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (matchPassword.current.value !== password.current.value) {
      matchPassword.current.setCustomValidity("Password doesn't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        dob: dob,
        gender: gender,
      };

      try {
        const res = await axios.post("/auth/register", user);
        console.log(res.data);
        // navigate("/login");
        setOtpSent(true);
      } catch (error) {
        setError(error.response.data.error);
        console.log(error);
      }
    }
  };

  return (
    <>
      {otpSent ? (
        <VerifyEmail email={email.current.value} />
      ) : (
        <form className="registerBox" onSubmit={handleRegister}>
          {error && (
            <Alert
              className="rg-alert"
              severity="error"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          <input
            required
            type="text"
            className="registerInput"
            placeholder="Username"
            ref={username}
          />
          <input
            required
            type="email"
            className="registerInput"
            placeholder="Email"
            ref={email}
          />
          <div className="dob-gender-wrapper">
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              placeholderText="Date of Birth"
              dateFormat="dd/MM/yyyy"
              className="registerInput"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
            <select
              className="registerInput gender-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option cl value="" disabled style={{ color: "gry" }}>
                Select Gender
              </option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
          <input
            required
            minLength={6}
            type="password"
            className="registerInput"
            placeholder="Password"
            ref={password}
          />
          <input
            required
            type="password"
            className="registerInput"
            placeholder="Repeat Password"
            ref={matchPassword}
          />
          <button className="registerButton" type="submit">
            Sign Up
          </button>
          <hr />
          <Link
            to={"/login"}
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            <span className="already">Already have an account?</span>
          </Link>
        </form>
      )}
    </>
  );
};

export default RegisterUser;
