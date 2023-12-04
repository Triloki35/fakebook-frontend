import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import SlidingPanel from "react-sliding-side-panel";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function Home({ socket, unseenProp }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openRightBar, setOpenRightBar] = useState(false);
  const {user} = useContext(AuthContext);
  const {unseen,setUnseen} = unseenProp;

  
  // getting unseen msg from db
  useEffect(() => {
    const fetchUnseenMsg = async() => {
      try {
        const res = await axios.get(`/conversations/unseen/${user._id}`);
        console.log(res.data);
        setUnseen(res.data.totalUnseenCount);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUnseenMsg();
  }, [user])

  // real time addon
  useEffect(() => {
    socket?.on("getMsg", (data) => {
      setUnseen((prev)=>prev+1);
    });
  }, [socket])

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



  const sidebarOpenBtn ={
    left:'0px',
  }

  const sidebarCloseBtn = {
    left:190+'px',
  }

  const rightBarOpenBtn = {
    right : '0px',
  }

  const rightbarCloseBtn = {
    right : '350px'
  }

  return (
    <>
      <Topbar socket={socket} unseen={unseen}/>
      <div className="homeContainer">

        <Sidebar isMobile={isMobile} openSideBar={openSideBar}/>
        <Feed socket={socket} isMobile={isMobile} />
        <Rightbar isMobile={isMobile} openRightBar={openRightBar}/>

        {isMobile && (
          <>
            {!openRightBar && <button
              className="swipeBtn left"
              onClick={() => setOpenSideBar(!openSideBar)}
              style={openSideBar ? sidebarCloseBtn : sidebarOpenBtn }
            >
              {openSideBar?<ArrowBack/>:<ArrowForward/>}
            </button>}
            <button
              className="swipeBtn right"
              onClick={() => setOpenRightBar(!openRightBar)}
              style={openRightBar ? rightbarCloseBtn : rightBarOpenBtn}
            >
             {openRightBar?<ArrowForward/>:<ArrowBack/>}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
