import React, { useContext, useEffect, useState } from "react";
import "./notificationModal.css";
import Post from "../post/Post";
import axios from "axios";
import { Cancel } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const NotificationModal = ({ notification, closeNotificationModal }) => {
  const API = process.env.REACT_APP_API;
  const [post, setPost] = useState(null);
  const {user} = useContext(AuthContext);

  useEffect(() => {

    notification.status = true;

    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API}posts/` + notification.postId);
        setPost(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const updateNotificationStatus = async () => {
      try {
        const res = await axios.patch(
          `${API}users/update-notification/${notification._id}/${user._id}`
        );
        console.log(res.data);
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // userInfo.notifications = res.data
        // localStorage.setItem("userInfo",JSON.stringify(userInfo));
      } catch (error) {
        console.log(error);
      }
    };
       
    fetchPost();
    updateNotificationStatus();

  }, [notification]);
  
  console.log(notification);
  console.log(post);
  return (
    <div className="notification-modal">
      <div className="notification-modal-content">
        <button
          className="notification-close-btn"
          onClick={closeNotificationModal}
        >
          <Cancel />
        </button>
        <div id="postContainer">{post && <Post post={post} />}</div>
      </div>
    </div>
  );
};

export default NotificationModal;
