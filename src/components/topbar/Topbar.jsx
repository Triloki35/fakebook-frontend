import React, { useContext, useEffect, useState } from "react";
import "./topbar.css";
import {
  Chat,
  Notifications,
  Person,
  Settings,
  Help,
  Logout,
  Feedback,
  ArrowForwardIos,
  Delete,
  Lock,
  Key,
  ArrowBack,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import NotificationModal from "../notificationModal/NotificationModal";
import FriendRequest from "../friend-request/FriendRequest";
import SearchBox from "../search/SearchBox";
import { Avatar, CircularProgress } from "@mui/material";
import HelpCompo from "../help/Help.jsx";
import { arrayBufferToBase64 } from "../../base64Converter.js";
import AccountSettings from "./AccountSettings.jsx";

const Topbar = ({ socket, unseen }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { user } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [activeBtn, setActivebtn] = useState(true);

  const [notifications, setNotifications] = useState(user?.notifications);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const [notificationBandage, setNotificationBandage] = useState(0);
  const [unread, setunread] = useState(false);

  const [friendRequestBandage, setFriendRequestBandage] = useState();
  const [friendRequestPanelVisible, setFriendRequestPanelVisible] =
    useState(false);

  // setting up modal
  const [showModal, setShowModal] = useState(false);
  const [clickedNotification, setClickedNotification] = useState(null);

  const [setting, setSetting] = useState(false);
  const [help, setHelp] = useState(false);
  const [feedback, setFeedback] = useState(false);

  // fetching notification
  const fetchNotifications = async () => {
    try {
      setLoadingNotification(true);
      const res = await axios.get(`${API}users/notifications/${user._id}`);
      const sortedNotifications = res.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      // console.log(sortedNotifications);
      setNotifications(sortedNotifications);
      // updating local storage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.notifications = res.data;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotification(false);
    }
  };
  //  setting bandage whenever notification change
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      setNotificationBandage(
        notifications.filter((n) => n?.status === false).length
      );
    }
  }, [notifications]);

  // socket event for notification
  useEffect(() => {
    socket?.on("Notification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  const handleNotificationClick = (notification) => {
    setClickedNotification(notification);
    setShowModal(true);
  };

  const closeNotificationModal = () => {
    setShowModal(false);
  };

  // friend-request
  useEffect(() => {
    setFriendRequestBandage(user?.friendRequests?.length);
  }, [user]);

  // increment bandage
  useEffect(() => {
    socket?.on("get-friendRequest", () => {
      setFriendRequestBandage((prev) => prev + 1);
    });
  }, [socket]);

  const handleFriendRequestsClick = () => {
    setFriendRequestPanelVisible(!friendRequestPanelVisible);
  };

  const handleDropDown = () => {
    setDropdown(!dropdown);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // console.log(notification);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
          <span className="logo">fakebook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <SearchBox socket={socket} />
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            <span className="topbarLink">Home</span>
          </Link>
          <Link
            to={"/profile/" + user.username}
            style={{ textDecoration: "none", color: "white" }}
          >
            <span className="topbarLink">Timeline</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem" onClick={handleFriendRequestsClick}>
            <Person />
            {friendRequestBandage !== 0 && (
              <span className="topbarIconBadge">{friendRequestBandage}</span>
            )}
          </div>
          <div className="topbarIconItem">
            <Link
              reloadDocument
              to={"/messenger"}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Chat />
              {unseen !== 0 && (
                <span className="topbarIconBadge">{unseen}</span>
              )}
            </Link>
          </div>
          <div
            className="topbarIconItem"
            onClick={() => {
              setToggleNotification(!toggleNotification);
              fetchNotifications();
            }}
          >
            <Notifications />
            {notificationBandage !== 0 && (
              <span className="topbarIconBadge">{notificationBandage}</span>
            )}
          </div>
          {toggleNotification && (
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
                    notifications?.map((n) => {
                      if (unread && !n.status) {
                        return (
                          <li
                            className="notification unread"
                            onClick={() => handleNotificationClick(n)}
                          >
                            <Avatar
                              src={`data:image/jpeg;base64,${arrayBufferToBase64(
                                n?.senderProfilePicture?.data
                              )}`}
                            />
                            <span className="notificationText">
                              {n.senderName}{" "}
                              {n.type === "tagged" && `${n.type} you in post`}
                              {n.type === "commented" &&
                                `${n.type} on your post`}
                              {n.type === "liked" && `${n.type} your post`}
                              {n.type === "accepted" &&
                                `${n.type} your friend request`}
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
                          >
                            <Avatar
                              src={`data:image/jpeg;base64,${arrayBufferToBase64(
                                n?.senderProfilePicture?.data
                              )}`}
                            />
                            <span className="notificationText">
                              {n.senderName}{" "}
                              {n.type === "tagged" && `${n.type} you in post`}
                              {n.type === "commented" &&
                                `${n.type} on your post`}
                              {n.type === "liked" && `${n.type} your post`}
                            </span>
                          </li>
                        );
                      }
                    })
                  )}
                </ul>
              </div>
            </div>
          )}

          {friendRequestPanelVisible && (
            <FriendRequest socket={socket} setFriendRequestBandage={setFriendRequestBandage} />
          )}
        </div>
        <Avatar
          className="topbarImg"
          src={`data:image/jpeg;base64,${arrayBufferToBase64(
            user?.profilePicture?.data
          )}`}
          onClick={handleDropDown}
        />

        {dropdown && (
          <div className="dropdownContainer">
            <div className="dropdownWrapper">
              <Link
                reloadDocument
                to={`/profile/${user.username}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="ddtop">
                  <div class="card ">
                    <img
                      src={
                        user.profilePicture
                          ? `data:image/jpeg;base64,${arrayBufferToBase64(
                              user?.profilePicture?.data
                            )}`
                          : `${PF}person/profile-picture/default-profilepic.png`
                      }
                      alt="profile pic"
                      className="topbarImg"
                    />
                    <span>{user.username}</span>
                    <i>
                      <ArrowForwardIos />
                    </i>
                  </div>
                </div>
              </Link>
              <div className="ddbottom">
                <ul>
                  {!setting ? (
                    <>
                      <li onClick={() => setSetting((p) => !p)}>
                        <Settings /> <span>Settings</span>
                      </li>
                      <li onClick={() => setHelp((p) => !p)}>
                        <Help /> <span>Help</span>
                      </li>
                      <li onClick={() => setFeedback((p) => !p)}>
                        <Feedback /> <span>Feedback</span>
                      </li>
                      <li onClick={handleLogout}>
                        <Logout /> <span>Logout</span>
                      </li>
                    </>
                  ) : (
                    <AccountSettings
                      setSetting={setSetting}
                      userId={user._id}
                    />
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <NotificationModal
          notification={clickedNotification}
          closeNotificationModal={closeNotificationModal}
        />
      )}

      {help && (
        <div className="topbarHelp">
          <HelpCompo setHelp={setHelp} />
        </div>
      )}

      {feedback && (
        <div className="topbarHelp">
          <HelpCompo setHelp={setFeedback} feedback={feedback} />
        </div>
      )}
    </div>
  );
};

export default Topbar;
