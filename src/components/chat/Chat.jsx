import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./chat.css";
import { Avatar } from "@mui/material";

const Chat = ({ message, own, friend }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;

  const [seen, setSeen] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API}messages/${message._id}/seen`);
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
    <div className={own ? "chat-common chatOwn" : "chat-common chat"}>
      {!own && (
        <Avatar className="chatImg" src={PF + friend?.profilePicture}/>
      )}

      <div
        className={own ? "chatMsgContainerOwn" :"chatMsgContainer"}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {message.content.images.map((img) => (
          <img src={PF + img} alt="" className="chatImgMsg" />
        ))}
        <p className={message.content.text !=='' && ( own ? "chatTextMsgOwn" : "chatTextMsg ")}>
          {message.content.text !=='' && message.content.text}
        </p>
        <div className="msgInfo">
        <span className={own ? "chatTimeOwn" : "chatTime"}>{format(message.createdAt)}</span>
        <small className="chat-seen">{toggle && seen && own && "Seen"}</small>
        </div>
      </div>
    </div>
  );
};

export default Chat;
