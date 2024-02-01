import React from "react";
import "./CoverAndProfilePics.css";
import { Avatar } from "@mui/material";
import { arrayBufferToBase64 } from "../base64Converter";

const CoverAndProfilePics = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // console.log(user);
  
  return (
    <div className="coverContainer">
      <img
        className="coverPic"
        src={
          user?.coverPicture
            ? `data:image/jpeg;base64,${arrayBufferToBase64(user?.coverPicture.data)}`
            : `${PF}default-cover.jpeg`
        }
        alt=""
      />
      <Avatar id="profilePic" src={`data:image/jpeg;base64,${arrayBufferToBase64(user?.profilePicture?.data)}`} />
    </div>
  );
};

export default CoverAndProfilePics;
