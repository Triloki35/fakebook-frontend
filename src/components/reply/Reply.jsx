import React, { useRef, useState } from "react";
import axios from "axios";
import "./reply.css";
import {
  PermMedia,
  EmojiEmotions,
  Send,
  Cancel,
} from "@mui/icons-material";
import Picker from "@emoji-mart/react";

const Reply = ({ currentConversation, user, message, setMessage, socket }) => {
  const API = process.env.REACT_APP_API;
  const fileInput = useRef();
  const replyText = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const friendId = currentConversation?.members.find((userId)=>userId !== user._id);

  new Picker({
    data: async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );

      return response.json();
    },
  });

  const handleImageChange = () => {
    const files = fileInput.current.files;

    if (files.length > 0) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview(null);
    }
  };

  const handleCancelImage = () => {
    fileInput.current.value = null;
    setImagePreview(null);
  };

  const handleReply = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("conversationId", currentConversation._id);
      formData.append("senderId", user._id);
      formData.append("text", replyText.current.value);

      // Append selected images to formData
      for (let i = 0; i < fileInput.current.files.length; i++) {
        formData.append("images", fileInput.current.files[i]);
      }

      const res = await axios.post(`${API}messages/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage([...message, res.data]);

      socket.emit("sendMsg",{
        senderId:user._id,
        receiverId:friendId,
        data:res.data
      })

      replyText.current.value = "";
      fileInput.current.value = null;
      setImagePreview(null);
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
        <label htmlFor="img">
          <PermMedia htmlColor="tomato" className="replyIcon" />
        </label>
        <EmojiEmotions
          htmlColor="gold"
          className="replyIcon"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
      </div>
      <div className="replyCenter">
        <textarea
          autoFocus
          className="replyMsg"
          name=""
          rows="1"
          ref={replyText}
        />
        <input
          type="file"
          ref={fileInput}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="img"
        />
        {imagePreview && (
          <div className="imagePreview">
            <img className="r-preview-img" src={imagePreview} alt="Preview" />
            <Cancel className="cancelImageBtn" onClick={handleCancelImage}/>
          </div>
        )}
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
            onClickOutside={() => setShowEmojiPicker(!showEmojiPicker)}
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
