import React, { useContext, useEffect, useState } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";

const NotificationPannel = ({
  setActivebtn,
  activeBtn,
  setunread,
  unread,
  loadingNotification,
  notifications,
  setNotificationBandage,
  setClickedNotification,
  setShowModal,
  fetchNotifications
}) => {
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleNotificationClick = async (notification) => {
    if (notification.type === "accepted") {
      notification.status = true;
      setNotificationBandage((p) => p - 1);
      const res = await axios.patch(
        `${API}users/update-notification/${notification._id}/${user._id}`
      );
      navigate("/profile/" + notification.senderName);
    } else {
      setClickedNotification(notification);
      setShowModal(true);
    }
  };

  const notificationMessages = {
    tagged: "tagged you in post",
    commented: "commented on your post",
    liked: "liked your post",
    accepted: "accepted your friend request",
  };

  return (
    <div className="notificationContainer">
      <div className="notificationWrapper">
        <h3 className="notificationHeading">Notifications</h3>
        <div className="notificationbtnContainer">
          <button
            className={activeBtn ? "activebtn" : "notificationbtn"}
            onClick={() => {
              setActivebtn(!activeBtn);
              setunread(!unread);
            }}
          >
            All
          </button>
          <button
            style={{ marginLeft: "5px" }}
            className={!activeBtn ? "activebtn" : "notificationbtn"}
            onClick={() => {
              setActivebtn(!activeBtn);
              setunread(!unread);
            }}
          >
            Unread
          </button>
        </div>
        <ul className="notificationList">
          {loadingNotification ? (
            <CircularProgress color="primary" />
          ) : notifications.length === 0 ? (
            <li>No notifiactions found</li>
          ) : (
            notifications?.map((n, i) => {
              if (unread && !n.status) {
                return (
                  <li
                    className="notification unread"
                    onClick={() => handleNotificationClick(n)}
                    key={i}
                  >
                    <Avatar
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(
                        n?.senderProfilePicture?.data
                      )}`}
                    />
                    <span className="notificationText">
                      {`${n.senderName} ${notificationMessages[n.type]}`}
                    </span>
                  </li>
                );
              } else if (!unread) {
                return (
                  <li
                    className={
                      !n.status ? "notification unread" : "notification"
                    }
                    onClick={() => handleNotificationClick(n)}
                    key={i}
                  >
                    <Avatar
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(
                        n?.senderProfilePicture?.data
                      )}`}
                    />
                    <span className="notificationText">
                      {`${n.senderName} ${notificationMessages[n.type]}`}
                    </span>
                  </li>
                );
              }
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPannel;
