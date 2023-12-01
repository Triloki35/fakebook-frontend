import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./reply.css";
import {
  KeyboardVoice,
  PermMedia,
  EmojiEmotions,
  Send,
} from "@mui/icons-material";
import Picker from "@emoji-mart/react";

const Reply = ({ currentConversation, user, message, setMessage, socket }) => {

  const replyText = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  new Picker({
    data: async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );

      return response.json();
    },
  });

  const handleReply = async (e) => {
    e.preventDefault();
    // console.log(replyText.current.value);
    try {
      const newMessage = {
        conversationId: currentConversation._id,
        senderId: user._id,
        text: replyText.current.value,
      };
      // console.log(newMessage);
      // socket event emit
      const receiverId = currentConversation?.members.filter(
        (id) => user._id !== id
      );
      socket.emit("sendMsg", {
        senderId: user._id,
        receiverId: receiverId,
        text: replyText.current.value,
      });

      const res = await axios.post("/messages/", newMessage);
      setMessage([...message, res.data]);
      replyText.current.value = "";
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    replyText.current.value += emoji.native;
  };

  return (
    <div className="reply">
      <div className="replyLeft">
        <PermMedia htmlColor="tomato" className="replyIcon" />
        <EmojiEmotions htmlColor="gold" className="replyIcon" onClick={()=>setShowEmojiPicker(!showEmojiPicker)}/>
        <KeyboardVoice htmlColor="teal" className="replyIcon" />
      </div>
      <div className="replyCenter">
        <textarea
          autoFocus
          className="replyMsg"
          name=""
          rows="1"
          ref={replyText}
        />
      </div>
      <div className="replyRight">
        <button className="replyBtn" onClick={handleReply}>
          {" "}
          <Send />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="reply-emoji-container">
          <Picker
            onEmojiSelect={handleEmojiSelect}
            onClickOutside={()=>setShowEmojiPicker(!showEmojiPicker)}
            theme="light"
            previewPosition="none"
            maxFrequentRows="1"
          />
        </div>
      )}
    </div>
  );
};

export default Reply;
