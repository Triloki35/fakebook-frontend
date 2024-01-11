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

const ProfilePc = ({
  user,
  username,
  unseen,
  jobsProp,
  videosProp,
  newsProp,
  eventsProp,
  bookmarksProp,
  helpProp
}) => {

  const { setShowVideos } = videosProp;
  const { setJobs } = jobsProp;
  const { setNews } = newsProp;
  const { setEvents } = eventsProp;
  const {setShowBookmark} = bookmarksProp;
  const {setHelp} = helpProp;

  return (
    <>
      <Topbar unseen={unseen} />
      <div className="profileContainer">
        <Sidebar
          setShowVideos={setShowVideos}
          setJobs={setJobs}
          setNews={setNews}
          setEvents={setEvents}
          setShowBookmark={setShowBookmark}
          setHelp={setHelp}
        />
        <div className="profileRight">
          <div className="profileRightTop">
            <CoverAndProfilePics user={user} />
            <ProfileInfo user={user} />
          </div>
          <div className="profileRightBottom">
            <div className="profileRightBottomLeft">
              <Feed
                username={username}
                jobsProp={jobsProp}
                videosProp={videosProp}
                newsProp={newsProp}
                eventsProp={eventsProp}
                bookmarksProp={bookmarksProp}
                helpProp={helpProp}
              />
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

const ProfileMobile = ({
  user,
  username,
  unseen,
  jobsProp,
  videosProp,
  newsProp,
  eventsProp,
  bookmarksProp,
  helpProp
}) => {
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
      <Feed
        username={username}
        jobsProp={jobsProp}
        videosProp={videosProp}
        newsProp={newsProp}
        eventsProp={eventsProp}
        bookmarksProp={bookmarksProp}
        helpProp={helpProp}
      />
    </>
  );
};

export default function Profile({ socket, unseenProp, callProp }) {
  const API = process.env.REACT_APP_API;
  const { user: currUser } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const { unseen, setUnseen } = unseenProp;
  const { setCall } = callProp;
  const [jobs, setJobs] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [news, setNews] = useState(false);
  const [events, setEvents] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [help, setHelp] = useState(false);
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
        const res = await axios.get(`${API}conversations/unseen/${currUser._id}`);
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
        const res = await axios.get(`${API}users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [username]);

  console.log("isMobile = " + isMobile);

  return (
    <>
      {isMobile ? (
        <ProfileMobile
          user={user}
          username={username}
          unseen={unseen}
          jobsProp={{ jobs, setJobs }}
          videosProp={{ showVideos, setShowVideos }}
          newsProp={{ news, setNews }}
          eventsProp={{ events, setEvents }}
          bookmarksProp={{showBookmark,setShowBookmark}}
          helpProp = {{help,setHelp}}
        />
      ) : (
        <ProfilePc
          user={user}
          username={username}
          unseen={unseen}
          jobsProp={{ jobs, setJobs }}
          videosProp={{ showVideos, setShowVideos }}
          newsProp={{ news, setNews }}
          eventsProp={{ events, setEvents }}
          bookmarksProp={{showBookmark,setShowBookmark}}
          helpProp={{help,setHelp}}
        />
      )}
    </>
  );
}
