import React from "react";
import "./CoverAndProfilePics.css";
import { Avatar } from "@mui/material";

const CoverAndProfilePics = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  return (
    <div className="coverContainer">
      <img
        className="coverPic"
        src={
          user?.coverPicture
            ? PF + user.coverPicture
            : `${PF}person/cover-picture/default-coverpic.jpeg`
        }
        alt=""
      />
      {/* <img
        className="profilePic"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : `${PF}person/profile-picture/default-profilepic.png`
        }
        alt=""
      /> */}
      <Avatar id="profilePic" src={PF + user?.profilePicture} />
    </div>
  );
};

export default CoverAndProfilePics;
