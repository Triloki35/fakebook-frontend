import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PostBottom = ({
  post,
  showUsersModal,
  setShowUsersModal,
  setCommentBox,
  commentBox,
  socket,
  setisLiked,
  isLiked,
  setLike,
  like,
  setLoadingComments,
  setPrevComment,
  commentsLength
}) => {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { user: currentUser } = useContext(AuthContext);
  // like
  const likeHandeler = async () => {
    setLike(isLiked ? like - 1 : like + 1);
    !isLiked && post.likes.push(currentUser._id);
    setisLiked(!isLiked);
    try {
      const res = await axios.put(`${API}posts/` + post._id + "/like", {
        userId: currentUser._id,
      });
      // const res = await axios.put(`http://localhost:8000/api/posts/` + post._id + "/like", {
      //   userId: currentUser._id,
      // });

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
  };

  // fetching comment
  const fetchComment = async () => {
    try {
      setLoadingComments(true);

      const res = await axios.get(`${API}posts/comments/${post._id}`);
      // const res = await axios.get(
      //   `http://localhost:8000/api/posts/comments/${post._id}`
      // );
      console.log(res.data);
      setPrevComment(res.data);
      // console.log(prevComment);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <div className="postBottom">
      <div className="postBottomLeft">
        <img
          className="likeIcon"
          src={PF + "like.png"}
          onClick={likeHandeler}
          alt=""
        />
        <img
          className="likeIcon"
          src={PF + "heart.png"}
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
            fetchComment();
          }}
        >
          {commentsLength > 0 && commentsLength} comments{" "}
        </span>
      </div>
    </div>
  );
};

export default PostBottom;
