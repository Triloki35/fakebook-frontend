import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const FriendList = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const [friendList, setFriendList] = useState([]);
  const [showAllFriends, setShowAllFriends] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(`${API}users/friends/` + user._id);
        setFriendList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  return (
    <>
      <div className="fl-top">
        <div className="fl-top-up">
          <h4 className="rightBarFriendTitle">Friends</h4>
          <h4
            style={{ color: "#1877F2" }}
            onClick={() => setShowAllFriends((prev) => !prev)}
          >
            {showAllFriends ? "Hide" : "See all"}
          </h4>
        </div>
        <small style={{ color: "gray" }}>
          {friendList.length !== 0 && friendList.length + " friends"}
        </small>
      </div>

      <div className="rightBarFriends">
        {friendList
          .slice(
            0,
            showAllFriends ? friendList.length : friendList.length >= 6 ? 6 : 4
          )
          .map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightBarFriend">
                <Avatar className="friendProfilePic" src={`data:image/jpeg;base64,${arrayBufferToBase64(friend?.profilePicture?.data)}`} variant="rounded"/>
                <span className="friendName">{friend.username}</span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default FriendList;
