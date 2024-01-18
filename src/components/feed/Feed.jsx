import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { AuthContext } from "../../context/AuthContext";
import NoPost from "../post/NoPost";
import ClipLoader from "react-spinners/ClipLoader";
import { v4 as uuidv4 } from "uuid";
import Jobs from "../jobs/Jobs.jsx";
import Videos from "../videos/Videos.jsx";
import News from "../news/News.jsx";
import Events from "../events/Events.jsx";
import Bookmarks from "../bookmarks/Bookmarks.jsx";
import Help from "../help/Help.jsx";

const Feed = ({
  username,
  socket,
  jobsProp,
  videosProp,
  newsProp,
  eventsProp,
  bookmarksProp,
  helpProp,
}) => {
  const API = process.env.REACT_APP_API;
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchMore, setFetchMore] = useState(true);

  const { jobs, setJobs } = jobsProp;
  const { showVideos, setShowVideos } = videosProp;
  const { news, setNews } = newsProp;
  const { events, setEvents } = eventsProp;
  const { showBookmark, setShowBookmark } = bookmarksProp;
  const { help, setHelp } = helpProp;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = username
        ? await axios.get(`${API}posts/profile/${username}?page=${page}`)
        : await axios.get(`${API}posts/timeline/${user._id}?page=${page}`);
      // const res = username
      //   ? await axios.get(`http://localhost:8000/api/posts/profile/${username}?page=${page}`)
      //   : await axios.get(`http://localhost:8000/api/posts/timeline/${user._id}?page=${page}`);

      const sortedPostsAscending = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (sortedPostsAscending.length !== 0) {
        setPosts((prevPosts) => [...prevPosts, ...sortedPostsAscending]);
      } else {
        setFetchMore(false);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchMore) fetchPosts(); 
  }, [page, username, user._id, fetchMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        fetchMore &&
        !loading &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMore, loading]);

  const renderContent = () => {
    switch (true) {
      case jobs:
        return <Jobs setJobs={setJobs} />;
      case showVideos:
        return <Videos setShowVideos={setShowVideos} />;
      case news:
        return <News setNews={setNews} />;
      case events:
        return <Events setEvents={setEvents} />;
      case showBookmark:
        return <Bookmarks setShowBookmark={setShowBookmark} socket={socket} />;
      case help:
        return <Help setHelp={setHelp} />;
      default:
        return (
          <>
            <Share socket={socket} />
            {posts.length !== 0 ? (
              posts.map((p) => <Post key={uuidv4()} post={p} socket={socket} />)
            ) : (
              <NoPost />
            )}
            {loading && (
              <p className="loading-text">
                <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
              </p>
            )}
          </>
        );
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">{renderContent()}</div>
    </div>
  );
};

export default Feed;
