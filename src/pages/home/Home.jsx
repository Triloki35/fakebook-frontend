import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

function Home({ socket, unseenProp, callProp }) {
  const API = process.env.REACT_APP_API;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openRightBar, setOpenRightBar] = useState(false);
  const { user } = useContext(AuthContext);
  const { unseen, setUnseen } = unseenProp;
  const { setCall } = callProp;
  const [jobs, setJobs] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [news, setNews] = useState(false);
  const [events, setEvents] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [help, setHelp] = useState(false);
  const [alert, setAlert] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  // getting unseen msg from db
  useEffect(() => {
    const fetchUnseenMsg = async () => {
      try {
        const res = await axios.get(`${API}conversations/unseen/${user._id}`);
        console.log(res.data);
        setUnseen(res.data.totalUnseenCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnseenMsg();
  }, [user]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const alertTimeout = setTimeout(() => {
      setAlert(false);
    }, 5000);
    return () => clearTimeout(alertTimeout);
  }, []);

  const sidebarOpenBtn = {
    left: "0px",
  };

  const sidebarCloseBtn = {
    left: 190 + "px",
  };

  const rightBarOpenBtn = {
    right: "0px",
  };

  const rightbarCloseBtn = {
    right: "350px",
  };

  // console.log(call);

  return (
    <>
      <Topbar socket={socket} unseen={unseen} />
      <div className="homeContainer">
        <Sidebar
          isMobile={isMobile}
          openSideBar={openSideBar}
          setJobs={setJobs}
          setShowVideos={setShowVideos}
          setNews={setNews}
          setEvents={setEvents}
          setShowBookmark={setShowBookmark}
          setHelp={setHelp}
        />
        <Feed
          socket={socket}
          isMobile={isMobile}
          jobsProp={{ jobs, setJobs }}
          videosProp={{ showVideos, setShowVideos }}
          newsProp={{ news, setNews }}
          eventsProp={{ events, setEvents }}
          bookmarksProp={{ showBookmark, setShowBookmark }}
          helpProp={{ help, setHelp }}
        />
        <Rightbar
          isMobile={isMobile}
          openRightBar={openRightBar}
          socket={socket}
        />

        {isMobile && (
          <>
            {!openRightBar && (
              <button
                className="swipeBtn left"
                onClick={() => setOpenSideBar(!openSideBar)}
                style={openSideBar ? sidebarCloseBtn : sidebarOpenBtn}
              >
                {openSideBar ? <ArrowBack /> : <ArrowForward />}
              </button>
            )}
            <button
              className="swipeBtn right"
              onClick={() => setOpenRightBar(!openRightBar)}
              style={openRightBar ? rightbarCloseBtn : rightBarOpenBtn}
            >
              {openRightBar ? <ArrowForward /> : <ArrowBack />}
            </button>
          </>
        )}
        {alert && (
          <Alert
            style={{
              position: "absolute",
           
            }}
            severity="info"
            onClose={() => setAlert(false)}
          >
            Please be patient. Our server is hosted on a free instance, which
            may take extra time to fetch data if it has turned off due to
            inactivity.
          </Alert>
        )}
      </div>
    </>
  );
}

export default Home;
