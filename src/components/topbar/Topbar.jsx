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
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import NotificationModal from "../notificationModal/NotificationModal";
import FriendRequest from "../friend-request/FriendRequest";
import SearchBox from "../search/SearchBox";
import { Avatar } from "@mui/material";
import HelpCompo from "../help/Help.jsx";
import { arrayBufferToBase64 } from "../../base64Converter.js";
import AccountSettings from "./AccountSettings.jsx";
import NotificationPannel from "./NotificationPannel.jsx";

const Topbar = ({ socket, unseen }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [activeBtn, setActivebtn] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const [notificationBandage, setNotificationBandage] = useState(0);
  const [unread, setunread] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchMore, setFetchMore] = useState(true);

  const [friendRequestBandage, setFriendRequestBandage] = useState(0);
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
      const res = await axios.get(
        `${API}users/notifications/${user._id}?page=${page}`
      );
      // const res = await axios.get(`http://localhost:8000/api/users/notifications/${user._id}?page=${page}`);
      const sortedNotifications = res.data.notifications?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (sortedNotifications.length !== 0)
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...sortedNotifications,
        ]);
      else setFetchMore(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotification(false);
    }
  };
  // fetching when page change
  useEffect(() => {
    fetchNotifications();
  }, [page]);

  //  setting bandage whenever notification change
  useEffect(() => {
    const getUnreadNotificationLength = async () => {
      try {
        const res = await axios.get(
          `${API}users/unread-notifications-count/${user._id}`
        );
        // const res = await axios.get(
        //   `http://localhost:8000/api/users/unread-notifications-count/${user._id}`
        // );
        setNotificationBandage(res.data.unreadNotificationsCount);
      } catch (error) {
        console.log("failed to update notificaton bandage");
      }
    };
    getUnreadNotificationLength();
  }, []);

  // socket event for notification
  useEffect(() => {
    socket?.on("Notification", () => {
      setNotificationBandage((prev) => prev + 1);
    });
  }, [socket]);

  const closeNotificationModal = () => {
    setShowModal(false);
  };

  // friend-request
  useEffect(() => {
    const fetchFriendRq = async () => {
      try {
        const res = await axios.get(`${API}users/friend-requests/${user._id}`);
        // const res = await axios.get(
        //   `http://localhost:8000/api/users/friend-requests/${user._id}`
        // );
        // console.log(res.data);
        setFriendRequestBandage(res.data.friendRequests.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRq();
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

  console.log(page);

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
            <NotificationPannel
              setActivebtn={setActivebtn}
              activeBtn={activeBtn}
              setunread={setunread}
              unread={unread}
              loadingNotification={loadingNotification}
              notifications={notifications}
              setNotificationBandage={setNotificationBandage}
              setClickedNotification={setClickedNotification}
              setShowModal={setShowModal}
              setPage={setPage}
              fetchMore={fetchMore}
            />
          )}

          {friendRequestPanelVisible && (
            <FriendRequest
              socket={socket}
              setFriendRequestBandage={setFriendRequestBandage}
            />
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
