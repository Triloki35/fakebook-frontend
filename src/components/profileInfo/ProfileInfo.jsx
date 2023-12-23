import React, { useContext, useEffect, useState } from "react";
import "./profileInfo.css";
import { AuthContext } from "../../context/AuthContext";
import FriendButton from "../../pages/profile/friendButton";
import { Add, Edit, MoreHoriz, Share } from "@mui/icons-material";
import ProfileEdit from "../profileEdit/ProfileEdit";
import { UpdateUser } from "../../context/AuthActions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

const ProfileInfo = ({ user }) => {
  const { user: currUser, dispatch } = useContext(AuthContext);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isAsked, setIsAsked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [showStoryMessage, setShowStoryMessage] = useState(false);

  const navigate = useNavigate();

  const handleClick = async () => {
    // make change in local storage
    if (isFriend) {
      try {
        const res = await axios.post(`/users/unfriend/${currUser._id}`, {
          _id: user._id,
        });
        dispatch(UpdateUser(res.data));
        setIsFriend(false);
      } catch (error) {
        console.log(error);
      }
    } else if (isRequested) {
      try {
        const res = await axios.post(
          `/users/cancel-friend-request/${currUser._id}`,
          { _id: user._id }
        );
        setIsRequested(false);
        dispatch(UpdateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    } else if (isAsked) {
      try {
        const res = await axios.post(
          "/users/accept-friend-request/" + currUser._id,
          {
            friendId: user._id,
          }
        );
        setIsAsked(false);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(UpdateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const reqbody = {
          _id: currUser._id,
          profilePicture: currUser.profilePicture,
          username: currUser.username,
        };
        const res = await axios.post(
          `/users/friend-request/${user._id}`,
          reqbody
        );
        // console.log(res.data);
        dispatch(UpdateUser(res.data));
        setIsRequested(true);
      } catch (error) {
        console.log(error);
      }
    }
    localStorage.setItem("userInfo", JSON.stringify(currUser));
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (user) {
      // console.log(user);
      setIsFriend(currUser.friends.includes(user._id));
      setIsRequested(currUser.sentRequest.includes(user._id));
      setIsAsked(currUser.friendRequests.some((rq) => rq._id === user._id));
    }
  }, [user, currUser]);

  const handleCopyUrl = () => {
    // Copy profile URL to clipboard
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);

    // Show and then hide the copy message
    setShowCopyMessage(true);
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 1000);
  };

  const handleStory = () => {
    setShowStoryMessage(true);
    setTimeout(() => {
      setShowStoryMessage(false);
    }, 1000);
  };

  return (
    <div className="profileInfo">
      <h4 className="profileName">{user?.username}</h4>
      <span className="profileDesc">{user?.desc}</span>

      {currUser._id !== user?._id ? (
        <FriendButton
          isFriend={isFriend}
          isRequested={isRequested}
          isAsked={isAsked}
          handleClick={handleClick}
        />
      ) : (
        <div className="ownBtnContainer">
          <button className="btn editBtn" onClick={handleEdit}>
            <Edit /> &nbsp;Edit profile
          </button>
          <button className="btn " onClick={handleStory}>
            <Add /> &nbsp; Add story
          </button>
          <button className="btn" onClick={handleCopyUrl}>
            <MoreHoriz />
          </button>
          <ProfileEdit isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      )}
      {showCopyMessage && (
        <div className="copy-message">Copied profile URL</div>
      )}
      {showStoryMessage && (
      
        <Alert className="story-message" severity="info">Coming soon...!!</Alert>
      )}
    </div>
  );
};

export default ProfileInfo;
