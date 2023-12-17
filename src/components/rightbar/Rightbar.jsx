import React from "react";
import "./rightbar.css";
import FriendSuggestions from "../friendSuggestion/FriendSuggestion";
import ProfileDetails from "../profileDetails/ProfileDetails";
import FriendList from "../friendList/FriendList";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const HomeRightBar = ({ socket }) => {
  return (
    <div>
      <div className="birthdayContainer">
        <img className="birthdayImg" src={PF + "gift.png"} alt="" />
        <span className="birthdayText">
          <b>Hemant Kumar</b> and <b>3 other friends</b> have birthday today
        </span>
      </div>

      <div className="advertisement">
        <img className="adImg" src={PF + "ad.png"} alt="" />
      </div>

      <div className="friendSuggestionList">
        <FriendSuggestions socket={socket} />
      </div>
    </div>
  );
};

const ProfileRightBar = ({ user }) => {
  return (
    <div className="ProfileRightBarContainer">
      <ProfileDetails user={user} />
      <FriendList user={user} />
    </div>
  );
};

const Rightbar = ({ user, isMobile, openRightBar, socket }) => {
  const isMoblieTrue = {
    display: "none",
  };

  const rightBarMobileView = {
    zIndex: "1000",
    position: "fixed",
    top: "50px",
    right: "0",
    background: "white",
    height: "100vh",
    width: "350px",
    overflowY: "scroll",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const isMobileFalse = {
    flex: `3.5`,
    height: `90vh`,
    overflowY: "scroll",
    position: "sticky",
    top: "50px",
  };

  return (
    <div
      className="rightbar"
      style={
        isMobile
          ? openRightBar
            ? rightBarMobileView
            : isMoblieTrue
          : isMobileFalse
      }
    >
      <div className="rightbarWrapper">
        {user ? (
          <ProfileRightBar user={user} />
        ) : (
          <HomeRightBar socket={socket} />
        )}
      </div>
    </div>
  );
};

export default Rightbar;
