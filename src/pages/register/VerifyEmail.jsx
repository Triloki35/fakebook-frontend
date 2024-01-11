import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = ({ email }) => {
  const API = process.env.REACT_APP_API;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message,setMessage] = useState(null);

  const handleVerify = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`${API}auth/verify-otp`, {
        email: email,
        otp: otp,
      });
      console.log(res.data);
      setMessage(res.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
    setLoading(false);
  };

  const sendAgain = async() => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}auth/resend-otp`, {email: email});
      console.log(res.data);
      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
    setLoading(false);
  }

  return (
    <>
      <form
        className="registerBox"
        onSubmit={handleVerify}
        style={{ height: "300px" }}
      >
        {message && (
          <Alert
            className="rg-alert"
            severity="success"
            onClose={() => setMessage(null)}
          >
            {message}
          </Alert>
        )}
        {error && (
          <Alert
            className="rg-alert"
            severity="error"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        <h4>Enter the code from your email</h4>
        <hr />
        <p style={{ color: "gray" }}>
          Let us know that this email address belongs to you <b>{email}</b>.
        </p>
        <input
          required
          type="text"
          className="registerInput"
          placeholder="Enter OTP send to your email"
          onChange={(e) => setOtp(e.target.value)}
        />

        <p className="send-again" onClick={sendAgain}>Send Email Again</p>

        <button className="registerButton" type="submit">
          {loading ? (
            <CircularProgress color="inherit" size={"35px"} />
          ) : (
            "Continue"
          )}
        </button>

        <hr />

        <Link
          to={"/login"}
          style={{ textDecoration: "none", textAlign: "center" }}
        >
          <span className="already">Already have an account?</span>
        </Link>
      </form>
    </>
  );
};

export default VerifyEmail;
