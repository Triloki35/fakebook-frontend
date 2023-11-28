import React, { useContext } from "react";
import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircle,
  Group,
  Bookmark,
  Work,
  HelpOutline,
  Event,
  SchoolSharp,
  Logout,
} from "@mui/icons-material";

import CloseFriend from "../closeFriend/CloseFriend";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ isMobile, openSideBar }) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
    window.location.reload();
  };

  const isMobileTrue = {
    display: "none",
  };

  const sideBarMobileView = {
    zIndex: "1000",
    position: "fixed",
    top: "50px",
    left: "0",
    background: "white",
    height: "100vh",
    overflowY: "scroll",
  };

  const isMobileFalse = {
    flex: "3",
    height: "90vh",
    overflowY: "scroll",
    position: "sticky",
    top: "50px",
  };

  return (
    <div
      style={
        isMobile
          ? openSideBar
            ? sideBarMobileView
            : isMobileTrue
          : isMobileFalse
      }
    >
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : `${PF}person/profile-picture/default-profilepic.png`
              }
              alt=""
            />
            <span className="sidebarListItemText">{user.username}</span>
          </li>
          <li className="sidebarListItem">
            <RssFeed /> <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat /> <span className="sidebarListItemText">Chat</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircle /> <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group /> <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark /> <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline /> <span className="sidebarListItemText">Help</span>
          </li>
          <li className="sidebarListItem">
            <Work /> <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event /> <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <SchoolSharp /> <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <button className="sb-logout" onClick={handleLogout}>
          <Logout /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
