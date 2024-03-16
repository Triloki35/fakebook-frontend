import React, { useState, useContext, useRef, useEffect } from "react";
import "./post.css";
import { Delete, MoreVert, Send } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import UsersModal from "../showUserModal/UsersModal";
import { Avatar, CircularProgress, LinearProgress, Skeleton } from "@mui/material";
import { arrayBufferToBase64 } from "../../services/base64Converter";
import PostTop from "./PostTop";
import PostCenter from "./PostCenter";
import PostBottom from "./PostBottom";

const Post = ({ post, socket }) => {
  const API = process.env.REACT_APP_API;
  const { user: currentUser } = useContext(AuthContext);

  // like
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setisLiked] = useState(
    post?.likes?.includes(currentUser._id)
  );
  const [showUsersModal, setShowUsersModal] = useState(false);

  // tag
  const [istag, setIstag] = useState(false);

  // comment box
  const [commentsLength, setCommentsLength] = useState(post?.comments);
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [prevComment, setPrevComment] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [deleteComment, setDeleteComment] = useState({});
  const [loadingDeleteComment,setLoadingDeleteComment]=useState(false);

  // for delete and save post
  const [optionBtn, setOptionBtn] = useState(false);
  const isDeleteButtonDisabled = currentUser._id !== post.userId;

   // useRef for delete-comment div


   const toggleDeleteComment = (commentId) => {
    setDeleteComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // comments handle
  const handleComments = (event) => {
    setComment(event.target.value);
  };

  const postComment = async () => {
    setSendingComment(true);
    try {
      const reqBody = {
        senderId: currentUser._id,
        senderName: currentUser.username,
        text: comment,
      };
      const res = await axios.post(`${API}posts/comments/${post._id}`, reqBody);
      // const res = await axios.post(
      //   `http://localhost:8000/api/posts/comments/${post._id}`,
      //   reqBody
      // );
      console.log(res.data);

      reqBody.profilePicture = currentUser.profilePicture;
      setPrevComment((prev) => [...prev, reqBody]);
      setComment("");
      setCommentsLength((p) => p + 1);
      // socket event
      currentUser._id !== post.userId &&
      socket?.emit("Notification", {receiverId: post.userId});
    } catch (error) {
      console.log(error);
    }
    setSendingComment(false);
  };

  const handleCommentDelete = async (commentId) => {
    setLoadingDeleteComment(true);
    try {
      // const res = await axios.delete(
      //   `http://localhost:8000/api/posts/comments/${post._id}/${commentId}/${currentUser._id }`
      // );
      const res = await axios.delete(
        `${API}posts/comments/${post._id}/${commentId}/${currentUser._id }`
      );
      setPrevComment(res.data);
      setCommentsLength((p)=>p-1);
    } catch (error) {
      console.log(error);
    }
    setLoadingDeleteComment(false);
  };

  const CommentSkelton = (cnt) => {
    const skeletons = [];
    for (let i = 0; i < cnt; i++) {
      skeletons.push(
        <li className="prev-comment" key={i}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            sx={{ marginLeft: "5px" }}
          />
        </li>
      );
    }
    return skeletons;
  };

  // console.log(post);
  // console.log(prevComment);
  // console.log(currentUser);

  return (
    <div className="post">
      <div className="postWrapper">
        <PostTop
          post={post}
          showUsersModal={showUsersModal}
          setShowUsersModal={setShowUsersModal}
          setIstag={setIstag}
          optionBtn={optionBtn}
          isDeleteButtonDisabled={isDeleteButtonDisabled}
          setOptionBtn={setOptionBtn}
        />

        <PostCenter post={post} />

        <PostBottom
          post={post}
          showUsersModal={showUsersModal}
          setShowUsersModal={setShowUsersModal}
          setCommentBox={setCommentBox}
          commentBox={commentBox}
          socket={socket}
          setisLiked={setisLiked}
          isLiked={isLiked}
          setLike={setLike}
          like={like}
          setLoadingComments={setLoadingComments}
          setPrevComment={setPrevComment}
          commentsLength={commentsLength}
        />

        {commentBox && (
          <div className="comment-box-container">
            <ul className="prev-comments">
              {commentsLength === 0 ? (
                <p className="no-comments">
                  Be the first to comment on this post!
                </p>
              ) : loadingComments ? (
                CommentSkelton(post.comments)
              ) : (
                prevComment?.map((c) => (
                  <li className="prev-comment" key={c._id}>
                    <Avatar
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(
                        c?.profilePicture?.data
                      )}`}
                    />
                    <div className="prev-comment-div">
                      <span>
                        <b>{c.senderName}</b>
                        <small className="comment-time">
                          &nbsp; {format(c.createdAt)}
                        </small>
                        <MoreVert
                          className="comment-option"
                          fontSize="10px"
                          onClick={()=>toggleDeleteComment(c._id)}
                        />
                        {deleteComment[c._id] && (
                          <div
                            className={(currentUser._id === post.userId || currentUser._id === c.senderId) ? "delete-comment" : "delete-comment-disable"}
                            onClick={() => handleCommentDelete(c._id)}
                          >
                          {loadingDeleteComment ? <CircularProgress size="20px" className="delete-icon"/> :<Delete className="delete-icon"/>}
                          </div>
                        )}
                      </span>
                      {c.text}
                    </div>
                  </li>
                ))
              )}
            </ul>

            <div className="comment-input-container">
              <input
                className="comment-input"
                type="text"
                placeholder="Write a comment..."
                onChange={handleComments}
                value={comment}
              />
              <button
                className="comment-btn"
                onClick={postComment}
                disabled={(comment === "" || sendingComment) && true}
              >
                {sendingComment ? <CircularProgress size="25px"/> :<Send />}
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
