import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Alert from "@mui/material/Alert";
import VerifyEmail from "./VerifyEmail";
import { CircularProgress } from "@mui/material";

const RegisterUser = () => {
  const API = process.env.REACT_APP_API;
  const username = useRef();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [matchPassword,setMatchPassword] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (matchPassword !== password) {
      matchPassword.current.setCustomValidity("Password doesn't match");
    } else {
      const user = {
        username: username.current.value,
        email: email,
        password: password,
        dob: dob,
        gender: gender,
      };

      try {
        const res = await axios.post(`${API}auth/register`, user);
        console.log(res.data);
        // navigate("/login");
        setOtpSent(true);
      } catch (error) {
        setError(error.response.data.error);
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {otpSent ? (
        <VerifyEmail email={email} />
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
            onChange={(e)=>setEmail(e.target.value)}
          />
          <div className="dob-gender-wrapper">
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              placeholderText="DOB"
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
              <option value="" disabled>
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            required
            type="password"
            className="registerInput"
            placeholder="Repeat Password"
            onChange={(e) => setMatchPassword(e.target.value)}
          />
          <button className="registerButton" type="submit">
            {loading ? <CircularProgress color="inherit" size={"35px"} /> :"Sign Up"}
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
