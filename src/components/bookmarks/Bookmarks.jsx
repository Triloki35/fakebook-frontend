import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ArrowBack } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import Post from "../post/Post";
import NoPost from "../post/NoPost";
import "./bookmarks.css";

const Bookmarks = ({ setShowBookmark, socket }) => {
  const API = process.env.REACT_APP_API;
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const noBookmarks = user?.bookmarks.length === 0;

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}posts/bookmarks/${user._id}`);
      setBookmarks(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []); // Add an empty dependency array to run once on mount

  return (
    <>
      <ArrowBack onClick={() => setShowBookmark(false)} />
      {loading && (
        <p style={{ textAlign: "center" }}>
          <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
        </p>
      )}
      {bookmarks.length !== 0 ? (
        bookmarks.map((b) => <Post key={uuidv4()} post={b} socket={socket} />)
      ) : (
        <h4 className="noBookmarks" style={{ textAlign: "center" }}>
          {noBookmarks ? "No saved post !!" : <NoPost />}
        </h4>
      )}
    </>
  );
};

export default Bookmarks;
