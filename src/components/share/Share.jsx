import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./share.css";
import axios from "axios";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Picker from "@emoji-mart/react";

const Share = () => {
  new Picker({
    data: async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );

      return response.json();
    },
  });
  const desc = useRef();
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // console.log(user);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
    // console.log(image);
  };

  const handleEmojiSelect = (emoji) => {
    desc.current.value += emoji.native;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("desc", desc.current.value);
    formData.append("image", image);

    console.log(formData);

    try {
      const response = await axios.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post uploaded successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div className="share">
      <form className="shareWrapper" onSubmit={handleSubmit}>
        <div className="shareTop">
          <Link
            to={`/profile/${user.username}`}
            style={{ textDecoration: "none" }}
          >
            <img
              className="shareProfileImg"
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : `${PF}person/profile-picture/default-profilepic.png`
              }
              alt=""
            />
          </Link>
          <input
            placeholder={"what's in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>

        <hr className="shareHr" />

        {image && (
          <div className="previewImgcontainer">
            <img
              className="previewImg"
              src={URL.createObjectURL(image)}
              alt=""
            />
            <Cancel
              className="previewCancel"
              onClick={() => {
                setImage(null);
              }}
            />
          </div>
        )}

        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <div className="shareOption">
              <Label id="tag-label" htmlColor="green" className="shareIcon" />
              <span id="tag-span" className="shareOptionText">
                Tags
              </span>
            </div>
            {/* <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div> */}
            <div className="shareOption">
              <EmojiEmotions
                htmlColor="goldenrod"
                className="shareIcon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </div>
      </form>
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

export default Share;
