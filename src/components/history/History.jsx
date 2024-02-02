import React, { useEffect, useState } from "react";
import "./history.css";
import axios from "axios";
import { format } from "timeago.js";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { Avatar, Skeleton } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const History = ({ conversation, lastMessage, curruser }) => {
  const API = process.env.REACT_APP_API;
  const [friend, setfriend] = useState(null);
  const [seen, setSeen] = useState(false);

  //
  useEffect(() => {
    const friendId = conversation?.members.filter((id) => curruser._id !== id);
    // console.log(friendId);
    const getFriend = async () => {
      try {
        const friendInfo = await axios.get(`${API}users?userId=${friendId}`);
        // const friendInfo = await axios.get(`http://localhost:8000/api/users?userId=${friendId}`);
        // console.log(friendInfo.data);
        setfriend(friendInfo.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriend();
  }, [conversation, curruser]);

  useEffect(() => {
    const getLastMsgStatus = async () => {
      if (lastMessage) {
        try {
          const res = await axios.get(
            `${API}messages/${lastMessage?._id}/seen`
          );
          //  console.log(res.data);
          setSeen(res.data.seen);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getLastMsgStatus();
  }, [lastMessage]);

  return (
    <div
      className="history"
      style={
        lastMessage?.senderId !== curruser._id && seen === false
          ? { background: "#e4e6eb" }
          : {}
      }
    >
      <Avatar
        className="historyImg"
        src={`data:image/jpeg;base64,${arrayBufferToBase64(
          friend?.profilePicture?.data
        )}`}
      />
      <div className="historyContainer">
        {friend?.username ? (
          <span className="historyName">{friend?.username}</span>
        ) : (
          <Skeleton variant="text" width={100}/>
        )}

        <div className="lastMsg">
          {!lastMessage ? (
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={1}>
              <LinearProgress color="inherit" />
              <LinearProgress color="inherit" />
            </Stack>
          ) : (
            <>
              <span className="historyMessage">
                <small>
                  {curruser._id === lastMessage.senderId && "You: "}
                  {lastMessage && lastMessage.content.text !== ""
                    ? lastMessage.content.text
                    : curruser._id !== lastMessage.senderId
                    ? `${friend?.username} sent photo`
                    : "photo"}
                </small>
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
