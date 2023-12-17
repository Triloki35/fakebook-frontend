import React, { useEffect, useState, useContext } from "react";
import "./profile.css";
import axios from "axios";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import CoverAndProfilePics from "../../coverAndprofile/CoverAndProfilePics";
import ProfileInfo from "../../components/profileInfo/ProfileInfo";
import { AuthContext } from "../../context/AuthContext";
import ProfileDetails from "../../components/profileDetails/ProfileDetails";
import FriendList from "../../components/friendList/FriendList";

const ProfilePc = ({ user, username, unseen }) => {
  return (
    <>
      <Topbar unseen={unseen} />
      <div className="profileContainer">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <CoverAndProfilePics user={user} />
            <ProfileInfo user={user} />
          </div>
          <div className="profileRightBottom">
            <div className="profileRightBottomLeft">
              <Feed username={username} />
            </div>
            <div className="profileRightBottomRight">
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileMobile = ({ user, username, unseen }) => {
  
  return (
    <>
      <Topbar unseen={unseen} />
      <CoverAndProfilePics user={user} />
      <div className="profileInfoWrapper">
        <ProfileInfo user={user} />
      </div>
      <div className="profileDetailsWrapper">
        <ProfileDetails user={user} />
      </div>
      <div className="friendListWrapper">
        <FriendList user={user} />
      </div>
      <Feed username={username} />
    </>
  );
};

export default function Profile({ socket, unseenProp, callProp }) {
  const { user: currUser } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const { unseen, setUnseen } = unseenProp;
  const { call, setCall } = callProp;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // fetching unseen msg from db
  useEffect(() => {
    const fetchUnseenMsg = async () => {
      try {
        console.log(currUser);
        const res = await axios.get(`/conversations/unseen/${currUser._id}`);
        console.log(res.data);
        setUnseen(res.data.totalUnseenCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnseenMsg();
  }, [currUser]);

  // real time addon
  useEffect(() => {
    socket?.on("getMsg", (data) => {
      setUnseen((prev) => prev + 1);
    });

    socket?.on("callUser", ({ from, signal, audio, video }) => {
      setCall({ from, signal, audio: audio, video: video });
      navigate("/call");
    });
  }, [socket]);

  // fetching user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [username]);

  console.log("isMobile = "+isMobile);

  return (
    <>
      {isMobile ? (
        <ProfileMobile user={user} username={username} unseen={unseen} />
      ) : (
        <ProfilePc user={user} username={username} unseen={unseen} />
      )}
    </>
  );
}
