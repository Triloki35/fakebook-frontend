import React from "react";
import "./noPost.css"
import { Skeleton } from "@mui/material";

const NoPost = () => {
  const generateSkeletons = (count) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div className="post" key={i}>
          <div className="postWrapper">
            <div className="nopostTop">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={200} sx={{ fontSize: "1rem" }} />
            </div>
            <div className="postCenter">
              <Skeleton variant="rounded" style={{width:"100%"}} height={300} />
            </div>
            {/* <div className="postBottom">
              <Skeleton variant="text" style={{width:"100%"}} sx={{ fontSize: "2rem" }} />
            </div> */}
          </div>
        </div>
      );
    }

    return skeletons;
  };

  return (
    <>
      {generateSkeletons(5)}
    </>
  );
};

export default NoPost;
