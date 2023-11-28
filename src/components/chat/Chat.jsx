import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./chat.css";

const Chat = ({ message, own, friend }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // console.log(friend);

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
          <div className="chatMsgContainer">
            <p className={own ? "chatMsg ownMsg" : "chatMsg "}>
              {message.text}
            </p>
            <time className="chatTime">{format(message.createdAt)}</time>
          </div>
        </div>
      </div>
  );
};

export default Chat;
