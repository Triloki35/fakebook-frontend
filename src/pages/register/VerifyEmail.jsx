import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmail = ({ email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/verify-otp", {
        email: email,
        otp: otp,
      });
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        className="registerBox"
        onSubmit={handleVerify}
        style={{ height: "300px" }}
      >
        <h4>Enter the code from your email</h4>
        <hr />
        <p style={{ color: "gray" }}>
          Let us know that this email address belongs to you. Enter the code
          from the email sent to {email}.
        </p>
        <input
          required
          type="text"
          className="registerInput"
          placeholder="Enter OTP send to your email"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="registerButton" type="submit">
          Continue
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
