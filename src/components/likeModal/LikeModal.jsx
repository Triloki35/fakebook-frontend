import React from "react";
import "./likeModal.css";
import { Cancel } from "@mui/icons-material";
import LikedUser from "./likedUser/LikedUser";

const LikeModal = ({setShowLikeModal, postLikes}) => {
 
  return (
    <div className="likeModalContainer">
      <div className="likeModalWrapper">
        <div className="lm-top">
          <span className="lm-top-title">All</span>
          <span className="lm-top-btn" onClick={()=>setShowLikeModal((prev)=>!prev)}>
            <Cancel />
          </span>
        </div>
        <div className="lm-bottom-wrapper">

          {postLikes.map((userId)=><LikedUser userId={userId}/>)}

        </div>

      </div>
    </div>
  );
};

export default LikeModal;
