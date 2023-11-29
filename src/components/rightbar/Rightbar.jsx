import React, { useEffect, useState } from "react";
import "./rightbar.css";
import OnlineFriend from "../onlineFriend/OnlineFriend";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchFriendList } from "../../apiCalls";
import FriendSuggestions from "../friendSuggestion/FriendSuggestion";
import { Favorite, Home, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const HomeRightBar = () => {
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
        <FriendSuggestions />
      </div>
    </div>
  );
};

const ProfileRightBar = ({ user }) => {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/users/friends/" + user._id);
        setFriendList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  return (
    <div className="ProfileRightBarContainer">
      <h4 className="rightBarTitle">User Information</h4>
      <ul className="rightBarInfo">
        <li className="rightBarInfoItems">
          <Home style={{ marginRight: "5px", color: "gray" }} /> Lives in &nbsp;
          <b>{user.city}</b>
        </li>
        <li className="rightBarInfoItems">
          <LocationOn style={{ marginRight: "5px", color: "gray" }} /> From
          &nbsp;
          <b>{user.from}</b>
        </li>
        <li className="rightBarInfoItems">
          <Favorite style={{ marginRight: "5px", color: "gray" }} />
          {user.relationship}
        </li>
      </ul>

      <h4 className="rightBarTitle">Friend's</h4>

      <div className="rightBarFriends">
        {friendList.map((friend) => (
          <Link reloadDocument to={"/profile/"+friend.username}>
            <div className="rightBarFriend">
              <img
                className="friendProfilePic"
                src={
                  friend.profilePicture
                    ? PF + friend.profilePicture
                    : `${PF}person/profile-picture/default-profilepic.png`
                }
                alt=""
              />
              <span className="friendName">{friend.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


const Rightbar = ({ user , isMobile, openRightBar}) => {

  const isMoblieTrue = {
    display : "none",
  }
  
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
    overflowY: 'scroll',
    position: 'sticky',
    top: '50px',
  }

  return (
    <div className="rightbar" style={isMobile?(openRightBar ? rightBarMobileView :  isMoblieTrue ):isMobileFalse}>
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar user={user} /> : <HomeRightBar />}
      </div>
    </div>
  );
};

export default Rightbar;
