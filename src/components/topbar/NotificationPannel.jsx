import React, { useContext, useEffect, useRef, useState } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import { arrayBufferToBase64 } from "../../services/base64Converter.js";
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
  setPage,
  fetchMore,
  toggleNotification,
  setToggleNotification,
}) => {
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const notificationContainerRef = useRef(null);

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

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        toggleNotification &&
        notificationContainerRef.current &&
        !notificationContainerRef.current.contains(event.target)
      ) {
        setToggleNotification(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [toggleNotification, setToggleNotification]);

  useEffect(() => {
    const notificationWrapper = document.querySelector(".notificationWrapper");

    const handleScroll = () => {
      if (
        fetchMore &&
        loadingNotification &&
        notificationWrapper.scrollHeight -
          notificationWrapper.scrollTop <=
          notificationWrapper.clientHeight + 10
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    notificationWrapper.addEventListener("scroll", handleScroll);

    return () => {
      notificationWrapper.removeEventListener("scroll", handleScroll);
    };
  }, [setPage]);

  return (
    <div className="notificationContainer" ref={notificationContainerRef}>
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
          {!loadingNotification && notifications.length === 0 && (
            <li>No notifications found</li>
          )}

          {notifications?.map((n, i) => {
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
          })}
        </ul>
        {!loadingNotification && (
          <CircularProgress
            color="primary"
            size="20px"
            sx={{ marginLeft: "50%" }}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationPannel;
