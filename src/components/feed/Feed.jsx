import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { AuthContext } from "../../context/AuthContext";

const Feed = ({ username , socket }) => {
  const { user } = useContext(AuthContext);
  const [posts, setposts] = useState([]);

  // console.log(userId);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("/posts/timeline/" + user._id);

      // console.log(res.data);

      const sortedPostsAscending = res.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      setposts(sortedPostsAscending);
    };
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share socket={socket}/>
        {posts.map((p) => (
          <Post key={p._id} post={p} socket={socket} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
