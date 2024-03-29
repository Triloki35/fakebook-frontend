import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./share.css";
import axios from "axios";
import { PermMedia, Label, EmojiEmotions, Cancel } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Picker from "@emoji-mart/react";
import { Alert, Avatar } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import { arrayBufferToBase64 } from "../../services/base64Converter";

const Share = ({ socket }) => {
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
  const [friendList, setFriendList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,  setError] = useState(null);
  const tagOptionsRef = useRef();

  // console.log(user);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(`${API}users/friends/` + user._id);
        setFriendList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
    // console.log(image);
  };

  const handleTagClick = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const labelForTagOption = document.getElementById("select"); 
      const isClickOnLabel = labelForTagOption.contains(event.target); 
      if (
        tagOptionsRef.current &&
        !tagOptionsRef.current.contains(event.target) &&
        !isClickOnLabel
      ) {
        setShowOptions(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tagOptionsRef]);
  

  const handleTagSelect = (friend) => {
    if (!selectedTags.some((tag) => tag._id === friend._id)) {
      const { username, _id } = friend;
      setSelectedTags((prevTags) => [...prevTags, { username, _id }]);
    }
  };

  const handleTagRemove = (friendId) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag._id !== friendId)
    );
  };

  const handleEmojiSelect = (emoji) => {
    desc.current.value += emoji.native;
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("username", user.username);
    // formData.append("profilePicture", user.profilePicture);
    formData.append("desc", desc.current.value);
    formData.append("image", image);

    // Append selected tags to the formData
    selectedTags.forEach((tag) => {
      formData.append("tags[]", JSON.stringify(tag));
    });

    try {
      const res = await axios.post(`${API}posts/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // const res = await axios.post(`http://localhost:8000/api/posts/`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      selectedTags.forEach((tag) => {
        socket?.emit("Notification", {receiverId: tag._id});
      });
      window.location.reload();
    } catch (error) {
      // console.error("Error uploading post:", error);
      setError(error?.response?.data);
    }
    setLoading(false);
  };

  console.log(error);

  return (
    <div className="share">
      <form className="shareWrapper" onSubmit={handleSubmit}>
        <div className="shareTop">
          <Link
            to={`/profile/${user.username}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              className="shareProfileImg"
              src={`data:image/jpeg;base64,${arrayBufferToBase64(user?.profilePicture?.data)}`}
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

            {/* Select input for tags */}
            <label
              htmlFor="select"
              id="select"
              className="shareOption"
              onClick={handleTagClick}
              ref={tagOptionsRef}
            >
              <Label id="tag-label" htmlColor="green" className="shareIcon" />
              <span id="tag-span" className="shareOptionText">
                Tags
              </span>
            </label>
            {showOptions && (
              <div ref={tagOptionsRef} className="tagOptions">
                {friendList.length === 0 ? (
                  <div className="noTag">
                    <h3>No friend found</h3>
                    <p>Add friend to tag</p>
                  </div>
                ) : (
                  friendList.map((f) => (
                    <div
                      key={f._id}
                      className={`tagOption ${
                        selectedTags.some((tag) => tag._id === f._id) &&
                        "tagOptionSelected"
                      }`}
                      onClick={() =>
                        selectedTags.some((tag) => tag._id === f._id)
                          ? handleTagRemove(f._id)
                          : handleTagSelect(f)
                      }
                    >
                      <Avatar src={`data:image/jpeg;base64,${arrayBufferToBase64(f?.profilePicture?.data)}`} />
                      <span>{f.username}</span>
                    </div>
                  ))
                )}
              </div>
            )}

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
            {loading ? (
              <ScaleLoader color="white" height={5} width={3} />
            ) : (
              "Share"
            )}
          </button>
        </div>
      </form>
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

      {error && (
        <Alert className="story-message" severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Share;
