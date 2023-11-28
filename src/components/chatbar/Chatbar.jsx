import React from "react";
import "./chatbar.css";
import { Link } from "react-router-dom";
import { Launch } from "@mui/icons-material";

function Chatbar({ friend }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="chatbarContainer">
      <div className="chatbarWrapper">
        <img
          className="chatbarImg"
          src={
            friend?.profilePicture !== ""
              ? PF + friend?.profilePicture
              : PF + "person/profile-pic/default-profilePic.png"
          }
          alt=""
        />
        <span className="chatbarName">{friend && friend.username}</span>
      </div>
      <Link to={`/profile/${friend?.username}`}>
        <Launch style={{ color: "rgb(0, 132, 255)", marginRight: "10px" }} />
      </Link>
    </div>
  );
}

export default Chatbar;
