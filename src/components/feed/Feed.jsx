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


const Feed = ({ username, socket, jobsProp, videosProp}) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchMore, setFetchMore] = useState(true);
  const {jobs,setJobs} = jobsProp ;
  const {showVideos , setShowVideos} = videosProp;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = username
        ? await axios.get(`/posts/profile/${username}?page=${page}`)
        : await axios.get(`/posts/timeline/${user._id}?page=${page}`);

      const sortedPostsAscending = await res.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

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
  }, []);

  const renderContent = () => {
    if (jobs) {
      return <Jobs setJobs={setJobs} />;
    } else {
      return (
        <>
          <Share socket={socket} />
          {posts.length !== 0 ? (
            posts.map((p) => <Post key={uuidv4()} post={p} socket={socket} />)
          ) : (
            <NoPost />
          )}
          {loading && (
            <p style={{ textAlign: "center" }}>
              <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
            </p>
          )}
        </>
      );
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
      {renderContent()}
      </div>
    </div>
  );
};

export default Feed;
