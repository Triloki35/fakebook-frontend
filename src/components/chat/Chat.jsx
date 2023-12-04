import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./chat.css";

const Chat = ({ message, own, friend }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [seen, setSeen] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/messages/${message._id}/seen`);
        setSeen(res.data.seen);
      } catch (error) {
        console.log(error);
      }
    };

    if (toggle) {
      fetchStatus();
    }
  }, [toggle, message._id]);

  return (
    <div className="chats">
      <div className={own ? "chatContainer own" : "chatContainer"}>
        {!own && (
          <img
            src={
              friend?.profilePicture !== ""
                ? PF + friend?.profilePicture
                : PF + "person/profile-pic/default-profilePic.png"
            }
            alt="user"
            className="chatImg"
          />
        )}
        <div
          className="chatMsgContainer"
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <p className={own ? "chatMsg ownMsg" : "chatMsg "}>
            {message.text}
          </p>
          <time className="chatTime">{format(message.createdAt)}</time>
          <small className="chat-seen">{toggle && seen && own && "Seen"}</small>
        </div>
      </div>
    </div>
  );
};

export default Chat;
