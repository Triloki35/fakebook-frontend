import React, { useState, useEffect, useContext, useRef } from "react";
import "./post.css";
import { MoreVert, Send } from "@mui/icons-material";
import axios from "axios";
import * as timeago from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post , socket}) => {
  // console.log(socket);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setuser] = useState({});

  // like
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setisLiked] = useState(post.likes.includes(currentUser._id));

  // comment box
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [prevComment, setPrevComment] = useState([]);

  // fetching user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      // console.log(res.data);
      setuser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  // like
  const likeHandeler = async() => {
    try {
      const res = await axios.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });

      if(res.data === "liked"){
        (currentUser._id !== post.userId) && socket?.emit("Notification",{
          postId : post._id,
          senderName : currentUser.username,
          senderProfilePicture : currentUser.profilePicture,
          receiverId : post.userId,
          type:"liked",
          status:false
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
        const res = await axios.get(`posts/comments/${post._id}`);
        setPrevComment(res.data);
        console.log(prevComment);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComment();
  }, [post])
  
 

  const postComment = async () => {
    console.log("comment=" + comment);
    try {
      const res = await axios.post(`posts/comments/${post._id}`, {
        senderId: currentUser._id,
        senderName: currentUser.username,
        text: comment,
        profilePicture: currentUser.profilePicture,
      });
      setComment("");
      setPrevComment((prev) => [...prev, res.data]);
      
      // socket event
      (currentUser._id !== post.userId) && socket?.emit("Notification",{
        postId : post._id,
        senderName : currentUser.username,
        senderProfilePicture : currentUser.profilePicture,
        receiverId : post.userId,
        type:"commented",
        status:false
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: "none" }}
            >
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : `${PF}person/profile-picture/default-profilepic.png`
                }
                alt=""
              />
            </Link>
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{timeago.format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
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
            <span className="postLikeCounter">{like} people like it</span>
          </div>

          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => {
                setCommentBox(!commentBox)
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
                  <img src={PF + c.profilePicture} alt="" />
                  <span>
                    <b style={{ marginBottom: "3px" }}>
                      {c.senderName}{" "}
                      <small style={{ color: "gray", fontWeight: "lighter" }}>
                        &nbsp; {timeago.format(c.createdAt)}
                      </small>{" "}
                    </b>{" "}
                    {c.text}
                  </span>
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
    </div>
  );
};

export default Post;
