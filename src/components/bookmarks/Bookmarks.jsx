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
  const [page, setPage] = useState(1);
  const [noMoreBookmarks, setNoMoreBookmarks] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [page]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}posts/bookmarks/${user._id}?page=${page}&limit=3`
      );
      // const res = await axios.get(
      //   `http://localhost:8000/api/posts/bookmarks/${user._id}?page=${page}&limit=3`
      // );
      if (res.data.length === 0) {
        setNoMoreBookmarks(true);
      } else {
        setBookmarks((prevBookmarks) => [...prevBookmarks, ...res.data]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom && !loading && !noMoreBookmarks) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ArrowBack onClick={() => setShowBookmark(false)} />
      {bookmarks.length !== 0 ? (
        bookmarks.map((b) => <Post key={uuidv4()} post={b} socket={socket} />)
      ) : (
        <h4 className="noBookmarks" style={{ textAlign: "center" }}>
          {noMoreBookmarks ? (
            "No more saved posts"
          ) : (
            <NoPost/>
          )}
        </h4>
      )}
      {loading && !noMoreBookmarks && (
        <p style={{ textAlign: "center" }}>
          <ClipLoader color={"#1877F2"} loading={true} speedMultiplier={2} />
        </p>
      )}
    </>
  );
};

export default Bookmarks;
