import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { AuthContext } from "../../context/AuthContext";
import NoPost from "../post/NoPost";
import ClipLoader from "react-spinners/ClipLoader";

const Feed = ({ username, socket }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [fetchMore, setFetchMore] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = username
          ? await axios.get(`/posts/profile/${username}`)
          : await axios.get(`/posts/timeline/${user._id}`);

        const sortedPostsAscending = res.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setPosts((prevPosts) => [...prevPosts, ...sortedPostsAscending]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchMore, username, user._id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
        !loading // Add this condition to check if not already loading
      ) {
        setFetchMore((prev) => prev + 1);
        setLoading(true);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, fetchMore]); // Add loading and fetchMore to the dependency array
  

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share socket={socket} />
        {posts.length !== 0 ? (
          posts.map((p) => <Post key={p._id} post={p} socket={socket} />)
        ) : (
          <NoPost />
        )}
        {loading && (
          <p style={{ textAlign: "center" }}>
            <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
