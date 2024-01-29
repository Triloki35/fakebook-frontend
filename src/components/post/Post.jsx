import React, { useState, useEffect, useContext } from "react";
import "./post.css";
import {
  Bookmark,
  BookmarkBorder,
  Delete,
  MoreHoriz,
  MoreVert,
  Send,
} from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";
import UsersModal from "../showUserModal/UsersModal";
import { Avatar, Skeleton } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const Post = ({ post, socket }) => {
  // console.log(socket);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  // const [user, setUser] = useState(null);
  // const [user, setuser] = useState({});

  // like
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setisLiked] = useState(post?.likes?.includes(currentUser._id));
  const [showUsersModal, setShowUsersModal] = useState(false);
  // tag
  const [istag, setIstag] = useState(false);
  // comment box
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [prevComment, setPrevComment] = useState([]);

  // for delete and save post
  const [optionBtn, setOptionBtn] = useState(false);
  const isDeleteButtonDisabled = currentUser._id !== post.userId;

  // like
  const likeHandeler = async () => {
    try {
      const res = await axios.put(`${API}posts/` + post._id + "/like", {
        userId: currentUser._id,
      });

      // socket emmit event when liked
      if (res.data.action === "liked") {
        currentUser._id !== post.userId &&
          socket?.emit("Notification", {
            postId: post._id,
            senderName: currentUser.username,
            senderProfilePicture: currentUser.profilePicture,
            receiverId: post.userId,
            type: "liked",
            status: false,
          });
      }
    } catch (error) {
      console.log(error);
    }

    setLike(isLiked ? like - 1 : like + 1);
    setisLiked(!isLiked);
  };

  // comments handle

  const handleComments = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`${API}posts/comments/${post._id}`);
        setPrevComment(res.data);
        // console.log(prevComment);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComment();
  }, [post]);

  const postComment = async () => {
    try {
      const reqBody = {
        senderId: currentUser._id,
        senderName: currentUser.username,
        text: comment,
        profilePicture: currentUser.profilePicture,
      };
      const res = await axios.post(`${API}posts/comments/${post._id}`, reqBody);
      console.log(res.data);
      setPrevComment((prev) => [...prev, reqBody]);
      setComment("");

      // socket event
      currentUser._id !== post.userId &&
        socket?.emit("Notification", {
          postId: post._id,
          senderName: currentUser.username,
          senderProfilePicture: currentUser.profilePicture,
          receiverId: post.userId,
          type: "commented",
          status: false,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await axios.delete(
        `${API}post/comments/${post._id}/${commentId}`,
        { userId: currentUser._id }
      );
      setPrevComment(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //delete and save

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

  const handleSavePost = async () => {
    try {
      const res = await axios.post(`${API}posts/save-post/${currentUser._id}`, {
        postId: post._id,
      });
      dispatch(UpdateUser(res.data));
      localStorage.setItem("userInfo", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(post);
  // console.log(currentUser.profilePicture);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              to={`/profile/${post?.username}`}
              style={{ textDecoration: "none" }}
            >
              <Avatar
                className="postProfileImg"
                src={`data:image/jpeg;base64,${arrayBufferToBase64(post?.profilePicture?.data)}`}
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
                        {post.tags.length} others
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
                  {currentUser.bookmarks.includes(post._id) ? (
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
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={`data:image/jpeg;base64,${arrayBufferToBase64(post?.img?.data)}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandeler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandeler}
              alt=""
            />
            <span
              className="postLikeCounter"
              onClick={() => setShowUsersModal(!showUsersModal)}
            >
              {like} people like it
            </span>
          </div>

          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => {
                setCommentBox(!commentBox);
              }}
            >
              {prevComment?.length > 0 && prevComment.length} comments{" "}
            </span>
          </div>
        </div>

        {commentBox && (
          <div className="comment-box-container">
            <ul className="prev-comments">
              {prevComment?.map((c) => (
                <li className="prev-comment" key={c._id}>
                  {/* <img src={PF + c.profilePicture} alt="" /> */}
                  <Avatar src={`data:image/jpeg;base64,${arrayBufferToBase64(c?.profilePicture?.data)}`}/>
                  <div className="prev-comment-div">
                    <span>
                      <b>{c.senderName}</b>
                      <small className="comment-time">
                        &nbsp; {format(c.createdAt)}
                      </small>
                      {(currentUser._id === c.senderId ||
                        post.userId === currentUser._id) && (
                        <MoreVert
                          className="comment-option"
                          fontSize="10px"
                          onClick={() => handleCommentDelete(c._id)}
                        />
                      )}
                    </span>
                    {c.text}
                  </div>
                </li>
              ))}
            </ul>

            <div className="comment-input-container">
              <input
                className="comment-input"
                type="text"
                placeholder="Write a comment..."
                onChange={handleComments}
                value={comment}
              />
              <button className="comment-btn" onClick={postComment}>
                <Send />
              </button>
            </div>
          </div>
        )}
      </div>
      {showUsersModal && (
        <UsersModal
          setShowUsersModal={setShowUsersModal}
          istag={istag}
          setIstag={setIstag}
          users={istag ? post.tags : post.likes}
        />
      )}
    </div>
  );
};

export default Post;
