import {
  Bookmark,
  BookmarkBorder,
  Delete,
  MoreHoriz,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { arrayBufferToBase64 } from "../../services/base64Converter";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";
import axios from "axios";

const PostTop = ({
  post,
  setShowUsersModal,
  setIstag,
  showUsersModal,
  optionBtn,
  isDeleteButtonDisabled,
  setOptionBtn,
}) => {
  const API = process.env.REACT_APP_API;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isBookmarked,setIsBookmarked] = useState(currentUser?.bookmarks?.includes(post._id) );

  // save
  const handleSavePost = async () => {
    setIsBookmarked((p)=>!p);
    try {
      const res = await axios.post(`${API}posts/save-post/${currentUser._id}`, {
        postId: post._id,
      });
      // const res = await axios.post(`http://localhost:8000/api/posts/save-post/${currentUser._id}`, {
      //   postId: post._id,
      // });
      dispatch(UpdateUser(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  //delete post
  const handleDeletePost = async () => {
    console.log(post.userId);
    console.log(currentUser._id);
    try {
      const res = await axios.delete(
        `${API}posts/${post._id}/${currentUser._id}`
      );
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(currentUser);

  return (
    <div className="postTop">
      <div className="postTopLeft">
        <Link
          to={`/profile/${post?.username}`}
          style={{ textDecoration: "none" }}
        >
          <Avatar
            className="postProfileImg"
            src={`data:image/jpeg;base64,${arrayBufferToBase64(
              post?.profilePicture?.data
            )}`}
          />
          {/* <img className="postProfileImg" src={`data:image/jpeg;base64,${arrayBufferToBase64(post?.profilePicture?.data)}`} alt="" srcset="" /> */}
        </Link>
        <div className="ps-l-wrapper">
          <div style={{ display: "flex" }}>
            <Link
              to={`/profile/${post?.username}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="postUsername">{post?.username}</span>
            </Link>
            <div>
              {post.tags?.length === 1 && (
                <small>
                  &nbsp; is with{" "}
                  <Link
                    to={`/profile/${post.tags[0].username}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {" "}
                    <b> {post.tags[0].username}</b>
                  </Link>
                </small>
              )}
              {post.tags?.length > 1 && (
                <small>
                  &nbsp; is with{" "}
                  <Link
                    to={`/profile/${post.tags[0].username}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {" "}
                    <b> {post.tags[0].username}</b>
                  </Link>{" "}
                  and{" "}
                  <b
                    className="other-tag"
                    onClick={() => {
                      setShowUsersModal(!showUsersModal);
                      setIstag(true);
                    }}
                  >
                    {post.tags.length - 1} others
                  </b>
                </small>
              )}
            </div>
          </div>
          <span className="postDate">{format(post.createdAt)}</span>
        </div>
      </div>

      <div className="postTopRight">
        {optionBtn && (
          <div className="postOptionBtnContainer">
            <div className="postSaveBtn" onClick={handleSavePost}>
              {isBookmarked? (
                <Bookmark />
              ) : (
                <BookmarkBorder />
              )}
              <span>Save</span>
            </div>
            <div
              className={
                isDeleteButtonDisabled ? "disabledStyle" : "postDeleteBtn"
              }
              onClick={handleDeletePost}
            >
              <Delete />
              <span>Delete</span>
            </div>
          </div>
        )}
        <MoreHoriz
          className="postTopRightIcon"
          onClick={() => setOptionBtn(!optionBtn)}
        />
      </div>
    </div>
  );
};

export default PostTop;
