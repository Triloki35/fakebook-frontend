import React from "react";
import "./chatbar.css";
import { Link } from "react-router-dom";
import { Call, ChevronLeft, Info, Videocam } from "@mui/icons-material";
import { Avatar } from "@mui/material";

function Chatbar({ friend, isMobile, setMessengerCenterVisible }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="chatbarContainer">
      <div className="chatbarLeft">
        <ChevronLeft
          onClick={() => {
            isMobile && setMessengerCenterVisible((prev) => !prev);
            window.location.reload();
          }}
        />
        <Avatar className="chatbarImg" src={PF + friend?.profilePicture}/>
        <span className="chatbarName">{friend && friend.username}</span>
      </div>
      <div className="chatbarRight">
        <Link to={`/call?caller=true`} state={{friend:friend,audio:true,video:false}}>
          <Call style={{ color: "rgb(0, 132, 255)", marginRight: "10px" }} />
        </Link>

        <Link to={`/call?caller=true`} state={{friend:friend,audio:true,video:true}}>
          <Videocam style={{ color: "rgb(0, 132, 255)", marginRight: "10px" }} />
        </Link>

        <Link to={`/profile/${friend?.username}`}>
          <Info style={{ color: "rgb(0, 132, 255)", marginRight: "10px" }} />
        </Link>
      </div>
    </div>
  );
}

export default Chatbar;
