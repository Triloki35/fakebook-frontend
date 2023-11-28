import React, { useEffect, useState } from "react";
import "./notificationModal.css";
import Post from "../post/Post";
import axios from "axios";
import { Cancel } from "@mui/icons-material";

const NotificationModal = ({ notification, closeNotificationModal }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {

    notification.status = true;

    const fetchPost = async () => {
      try {
        const res = await axios.get("/posts/" + notification.postId);
        setPost(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const updateNotificationStatus = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const res = await axios.patch(
          `/users/update-notification/${notification._id}/${userInfo._id}`
        );
        userInfo.notification = res.data.notification;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
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
