import React, { useContext, useState } from "react";
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
  Newspaper,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Alert, Avatar } from "@mui/material";
import Help from "../help/Help";

const Sidebar = ({ isMobile, openSideBar, setJobs, setShowVideos, setNews, setEvents, setShowBookmark, setHelp}) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [alert, setAlert] = useState(false);
  const [showMore, setShowMore] = useState(false);
 

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
    window.location.reload();
  };

  const handleAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 1000);
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
          <Link
            to={"/profile/" + user.username}
            className="sidebarListItem"
            style={{ textDecoration: "none", color: "black" }}
          >
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : `${PF}person/profile-picture/default-profilepic.png`
              }
              alt=""
            />
            <span className="sidebarListItemText">{user.username}</span>
          </Link>
          <Link
            to={"/"}
            className="sidebarListItem"
            style={{ textDecoration: "none", color: "black" }}
          >
            <RssFeed /> <span className="sidebarListItemText">Feed</span>
          </Link>
          <Link
            to={"/messenger"}
            className="sidebarListItem"
            style={{ textDecoration: "none", color: "black" }}
          >
            <Chat /> <span className="sidebarListItemText">Chat</span>
          </Link>
          <li
            className="sidebarListItem"
            onClick={() => setShowVideos && setShowVideos(true)}
          >
            <PlayCircle /> <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem" onClick={()=>setShowBookmark(true)}>
            <Bookmark /> <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem" onClick={()=>setNews(true)}>
            <Newspaper /> <span className="sidebarListItemText">News</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => setJobs && setJobs(true)}
          >
            <Work /> <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem" onClick={()=>setEvents(true)}>
            <Event /> <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem" onClick={()=>setHelp((p)=>!p)}>
            <HelpOutline /> <span className="sidebarListItemText">Help</span>
          </li>
          {showMore && (
            <>
              <li className="sidebarListItem" onClick={handleAlert}>
                <SchoolSharp />
                <span className="sidebarListItemText">Courses</span>
              </li>
              <li className="sidebarListItem" onClick={handleAlert}>
                <Group /> <span className="sidebarListItemText">Groups</span>
              </li>
            </>
          )}
        </ul>
        <button
          className="sidebarButton"
          onClick={() => {
            setShowMore((prev) => !prev);
          }}
        >
          {!showMore ? "Show More" : "Hide"}
        </button>
        <hr className="sidebarHr" />
        <button className="sb-logout" onClick={handleLogout}>
          <Logout /> <span>Logout</span>
        </button>
      </div>
      
      {alert && (
        <Alert className="story-message" severity="info">
          Coming soon...!!
        </Alert>
      )}
    </div>
  );
};

export default Sidebar;
