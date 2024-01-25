import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./register.css";
import RegisterUser from "./RegisterUser";


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
         <RegisterUser/>
        </div>
      </div>
      <footer className="footer">
        <p>
          &copy; 2024 Your fakebook. All rights reserved. Designed by triloki35
        </p>
      </footer>
    </div>
  );
}
