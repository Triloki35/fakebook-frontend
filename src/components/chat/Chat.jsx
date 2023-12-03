import React, { useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./chat.css";

const Chat = ({ message, own, friend }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [seen,setSeen] = useState(false);
  const [toggle,setToggle] = useState(false);

  const fetchStatus = async() => {
    if(toggle){
      try {
        const res = await axios.get(`messages/${message._id}/seen`);
        console.log(res.data);
        setSeen(res.data.seen)
      } catch (error) {
        console.log(error);
      }
    }
  }
  
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
          <div className="chatMsgContainer" onClick={()=>{setToggle(!toggle);fetchStatus()}}>
            <p className={own ? "chatMsg ownMsg" : "chatMsg "}>
              {message.text}
            </p>
            <time className="chatTime">{format(message.createdAt)}</time>
            <small className="chat-seen">{(toggle && seen && own) && "Seen"}</small>
          </div>
        </div>
      </div>
  );
};

export default Chat;
