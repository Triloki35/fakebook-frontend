import React, { useState } from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Message, MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FriendButton = ({ isFriend, isRequested, isAsked, handleClick }) => {
  const navigate = useNavigate();
  const iconStyle = { marginRight: "10px" };
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const setButtonText = () => {
    if (isFriend) {
      return "unfriend";
    } else if (isRequested) {
      return "Cancel request";
    } else if (isAsked) {
      return "Confirm";
    } else {

      return  window.innerWidth <= 768 ? "Add" : "Add Friend" ;
    }
  };

  const buttonText = setButtonText();

  const handleCopyUrl = () => {
    // Copy profile URL to clipboard
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);

    // Show and then hide the copy message
    setShowCopyMessage(true);
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 1000);
  };

  return (
    <div className="friendBtnContainer">
      <button
        className={`btn ${isFriend || isRequested ? "unfriendBtn" : "friendBtn"}`}
        onClick={handleClick}
      >
        {(isFriend || isRequested) && <PersonRemoveIcon style={iconStyle} />}
        {!isFriend && !isRequested && <PersonAddAlt1Icon style={iconStyle} />}
        {buttonText}
      </button>

      <button
        className={`btn ${!(isFriend || isRequested) ? "unfriendBtn" : "friendBtn"}`}
        onClick={() => {
          navigate("/messenger");
        }}
      >
        <Message /> &nbsp; Messenger
      </button>

      <button className="btn" onClick={handleCopyUrl}>
        <MoreHoriz />
      </button>

      {showCopyMessage && (
        <div className="copy-message">
          Copied profile URL
        </div>
      )}
    </div>
  );
};

export default FriendButton;
