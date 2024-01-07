import React, { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterUser from "./RegisterUser";
import VerifyEmail from "./VerifyEmail";

export default function Register() {
  return (
    <div className="registerContainer">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h1 className="registerLogo">fakebook</h1>
          <span className="registerDesc">
            Connecting with your friends, family and people you know.
          </span>
        </div>
        <div className="registerRight">
         {/* {otpSent ? <VerifyEmail email={email}/>  :<RegisterUser email={email} setOtpSent={setOtpSent}/>} */}
         <RegisterUser/>
        </div>
      </div>
    </div>
  );
}
