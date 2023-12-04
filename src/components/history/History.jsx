import React, { useEffect, useState } from "react";
import "./history.css";
import axios from "axios";
import { format } from "timeago.js";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const History = ({ conversation, lastMessage, curruser }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friend, setfriend] = useState(null);
  const [seen , setSeen] = useState(false);

  //
  useEffect(() => {
    const friendId = conversation?.members.filter((id) => curruser._id !== id);
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
  }, [conversation,curruser]);

  useEffect(() => {
    const getLastMsgStatus = async() => {
      if(lastMessage){
        try {
         const res = await axios.get(`/messages/${lastMessage?._id}/seen`);
        //  console.log(res.data);
         setSeen(res.data.seen);
        } catch (error) {
         console.log(error);
        } 
       }
      }
     getLastMsgStatus();
  }, [lastMessage])
  
    
  return (
    <div className="history" style={(lastMessage?.senderId !== curruser._id && seen===false) ? {background:"#e4e6eb"} : {}}>
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
          {!lastMessage ? (
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={1}>
              <LinearProgress color="inherit" />
              <LinearProgress color="inherit" />
            </Stack>
          ) : ( 
            <>
              <span className="historyMessage">
                <small>{curruser._id === lastMessage.senderId && "You: " } {lastMessage?.text}</small>
              </span>
              <span className="time">
                <small className="dot"> . </small>
                <small>{format(lastMessage?.createdAt)}</small>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
