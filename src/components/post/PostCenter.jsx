import React from "react";
import { arrayBufferToBase64 } from "../../base64Converter";

function PostCenter({post}) {
  return (
    <div className="postCenter">
      <span className="postText">{post?.desc}</span>
      <img
        className="postImg"
        src={`data:image/jpeg;base64,${arrayBufferToBase64(post?.img?.data)}`}
        alt=""
      />
    </div>
  );
}

export default PostCenter;
