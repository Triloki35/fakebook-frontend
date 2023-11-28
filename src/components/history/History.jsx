import React, { useEffect, useState } from "react";
import "./history.css";
import axios from "axios";

const History = ({ conversation, curruser }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friend, setfriend] = useState(null);

  //
  useEffect(() => {
    const friendId = conversation.members.filter((id) => curruser._id !== id);
    // console.log(friendId);
    const getFriend = async () => {
      try {
        const friendInfo = await axios.get(`/users?userId=${friendId}`);
        // console.log(friendInfo.data);
        setfriend(friendInfo.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriend();
  }, [conversation, curruser]);

  // console.log(friend);

  return (
    <div className="history">
        <img
          src={
            friend?.profilePicture !== ""
              ? PF + friend?.profilePicture
              : PF + "person/profile-picture/default-profilePic.png"
          }
          alt="user"
          className="historyImg"
        />
      <div className="historyContainer">
        <span className="historyName">{friend?.username}</span>
        <div className="lastMsg">
          <small className="historyMessage">love you</small>
          <small className="dot"> . </small>
          <small className="time">02.00pm</small>
        </div>
      </div>
    </div>
  );
};

export default History;
