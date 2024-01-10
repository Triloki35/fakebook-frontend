import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import NoPost from "../post/NoPost";
import ClipLoader from "react-spinners/ClipLoader";
import { v4 as uuidv4 } from "uuid";
import Post from "../post/Post";
import "./bookmarks.css";
import { ArrowBack } from "@mui/icons-material";

const Bookmarks = ({ setShowBookmark, socket }) => {
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noBookmarks, setNoBookmarks] = useState(user?.bookmarks.length === 0);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/posts/bookmarks/${user._id}`);
      setBookmarks(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return (
    <div>
      <ArrowBack onClick={() => setShowBookmark(false)} />
      {bookmarks.length !== 0 ? (
        bookmarks.map((b) => <Post key={uuidv4()} post={b} socket={socket} />)
      ) : noBookmarks ? (
        <h4 className="noBookmarks" style={{ textAlign: "center" }}>
          No saved post !!
        </h4>
      ) : (
        <NoPost />
      )}
      {loading && (
        <p style={{ textAlign: "center" }}>
          <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
        </p>
      )}
    </div>
  );
};

export default Bookmarks;
