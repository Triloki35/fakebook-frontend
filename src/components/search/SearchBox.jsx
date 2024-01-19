import React, { useState, useEffect } from "react";
import "./searchBox.css";
import { Cancel, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import Post from "../post/Post";
import { Avatar } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const SearchBox = ({ socket }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API}search/search-results?query=${searchQuery}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleClick = async (postId) => {
    console.log("clicked");
    try {
      const res = await axios.get(`${API}posts/` + postId);
      setSelectedPost(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setSelectedPost(null);
  };

  return (
    <div className="searchbar">
      <Search className="searchIcon" />
      <input
        placeholder="Search for friend, post or video"
        className="searchInput"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Display search results only if searchQuery is not empty */}
      {searchQuery && (
        <div className="searchResults">
          {/* Display user results */}
          <div>
            <h3>Users</h3>
            <ul className="result-list">
              {searchResults.users.map((user) => (
                <li key={user._id}>
                  <Link
                    className="result-user"
                    to={"/profile/" + user.username}
                  >
                    <Avatar className="sr-pp" src={`data:image/jpeg;base64,${arrayBufferToBase64(user?.profilePicture?.data)}`} />
                    <span>{user.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Display post results */}
          <div>
            <h3>Posts</h3>
            <ul className="result-list">
              {searchResults.posts.map((post) => (
                <li key={post._id} onClick={() => handleClick(post._id)}>
                  <img src={`data:image/jpeg;base64,${arrayBufferToBase64(post?.img?.data)}`} className="sr-post" alt="" />
                  <span>{post.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Render the selected post */}
      {selectedPost && (
        <div className="notification-modal">
      <div className="notification-modal-content">
        <button
          className="notification-close-btn"
          onClick={handleClose}
        >
          <Cancel />
        </button>
        <div id="postContainer"><Post post={selectedPost} socket={socket} /></div>
      </div>
    </div>
      )}
    </div>
  );
};



export default SearchBox;
