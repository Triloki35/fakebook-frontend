import React, { useEffect, useState } from "react";
import "./home.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import SlidingPanel from "react-sliding-side-panel";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

function Home({ socket }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openRightBar, setOpenRightBar] = useState(false);
  
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

  return (
    <>
      <Topbar socket={socket} />
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
