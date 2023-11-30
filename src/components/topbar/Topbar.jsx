import React, { useContext, useEffect, useState } from "react";
import "./topbar.css";
import {
  Chat,
  Notifications,
  Person,
  Search,
  Settings,
  Help,
  Logout,
  Feedback,
  ArrowForwardIos,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import NotificationModal from "../notificationModal/NotificationModal";
import FriendRequest from "../friend-request/FriendRequest";
import SearchBox from "../search/SearchBox";
import { UpdateUser } from "../../context/AuthActions";

const Topbar = ({ socket }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user , dispatch} = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [activeBtn, setActivebtn] = useState(true);

  const [notification, setNotification] = useState([user?.notification]);
  const [toggleNotification, setToggleNotification] = useState(false);
  const [notificationBandage, setNotificationBandage] = useState();
  const [unread, setunread] = useState(false);
  const [friendRequestBandage, setFriendRequestBandage] = useState();
  const [friendRequestPanelVisible, setFriendRequestPanelVisible] =
    useState(false);

  // setting up modal
  const [showModal, setShowModal] = useState(false);
  const [clickedNotification, setClickedNotification] = useState(null);


  useEffect(() => {
    if (notification && Array.isArray(notification)) {
      setNotificationBandage(
        notification.filter((item) => item?.status === false).length
      );
    }
  }, [notification]);

  useEffect(() => {
    socket?.on("Notification", (data) => {
      console.log(data);

      const newNotification = {
        _id: uuidv4(),
        postId: data.postId,
        senderName: data.senderName,
        senderProfilePicture: data.senderProfilePicture,
        receiverId: data.receiverId,
        type: data.type,
        status: false,
        createdAt: new Date(),
      };

      // updating notification in frontend
      setNotification((prev) =>
        [...prev, newNotification]
      );

      // api call to post new notification
      const pushNotificationToDb = async () => {
        try {
          // updating notification to db
          const res = await axios.put(
            "/users/notifications/" + user._id,
            newNotification
          );

          // updating notification in local storage
          localStorage.setItem("userInfo",JSON.stringify(res.data));
          dispatch(UpdateUser(res.data));
        } catch (error) {
          console.log("Error while sending notification to db" + error);
        }
      };

      pushNotificationToDb();
    });
  }, [socket]);

  const handleNotificationClick = (notification) => {
    setClickedNotification(notification);
    setShowModal(true);
  };

  const closeNotificationModal = () => {
    setNotificationBandage(
      notification.filter((n) => n.status === false).length
    );
    setShowModal(false);
  };

  // friend-request
  useEffect(() => {
    setFriendRequestBandage(user?.friendRequests?.length);
  }, [user]);

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
        <SearchBox socket={socket}/>
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
              to={"/messenger"}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Chat />
              <span className="topbarIconBadge">2</span>
            </Link>
          </div>
          <div
            className="topbarIconItem"
            onClick={() => setToggleNotification(!toggleNotification)}
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
                  {notification.map((n) => {
                    if (unread && !n.status) {
                      return (
                        <li
                          className="notification unread"
                          onClick={() => handleNotificationClick(n)}
                        >
                          <img
                            className="notificationImg"
                            src={PF + n.senderProfilePicture}
                            alt="img"
                          />
                          <span className="notificationText">
                            {n.senderName}{" "}
                            {n.type === "commented" ? n.type + " on" : n.type}{" "}
                            your post
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
                          <img
                            className="notificationImg"
                            src={PF + n.senderProfilePicture}
                            alt="img"
                          />
                          <span className="notificationText">
                            {n.senderName}{" "}
                            {n.type === "commented" ? n.type + " on" : n.type}{" "}
                            your post
                          </span>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>
          )}

          {friendRequestPanelVisible && <FriendRequest setFriendRequestBandage={setFriendRequestBandage} />}
        </div>
        <img
          src={
            user.profilePicture
              ? `${PF + user.profilePicture}`
              : `${PF}person/profile-picture/default-profilepic.png`
          }
          alt="profile pic"
          className="topbarImg"
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
                          ? PF + user.profilePicture
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
                  <li>
                    <Settings /> <span>Settings</span>
                  </li>
                  <li>
                    <Help /> <span>Help</span>
                  </li>
                  <li>
                    <Feedback /> <span>Feedback</span>
                  </li>
                  <li onClick={handleLogout}>
                    <Logout /> <span>Logout</span>
                  </li>
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
    </div>
  );
};

export default Topbar;
