import { ArrowBack } from "@mui/icons-material";
import "./videos.css";
import {
  Avatar,
  Button,
  List,
  Skeleton,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Videos = ({ setShowVideos }) => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const KEY = process.env.REACT_APP_VIDEO_KEY;

  const searchVideos = async () => {
    setLoading(true);
    try {
      const youtubeApiParams = {
        part: "snippet",
        maxResults: 20,
        q: query,
        type: "video",
        videoDefinition: "any",
        videoEmbeddable: true,
        key: KEY,
      };
      const apiUrl = "https://www.googleapis.com/youtube/v3/search";
      const res = await axios.get(apiUrl, { params: youtubeApiParams });
      //   console.log(res.data.items);
      setSearchResult(res.data.items);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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
          </div>
        </div>
      );
    }

    return skeletons;
  };

  console.log(searchResult);

  return (
    <>
      <div className="video-search-container">
        <ArrowBack
          className="video-back-btn"
          onClick={() => setShowVideos(false)}
        />
        <TextField
          style={{ width: "400px" }}
          id="standard-basic"
          label="Search videos"
          variant="standard"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="contained"
          size="small"
          style={{ height: "30px", marginRight: "5px" }}
          onClick={() => {
            setSearchResult([]);
            searchVideos();
          }}
        >
          {loading ? (
            <ClipLoader
              size={15}
              color={"white"}
              loading={true}
              speedMultiplier={2}
            />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {searchResult &&
          searchResult.map((s, index) => (
            <div key={index} className="post">
              <div className="postWrapper">
                <div className="postTop">
                  <div className="postTopLeft">
                    <Avatar src={s.snippet.thumbnails.default.url} />
                    <span className="channel-name">
                      {s.snippet.channelTitle}
                    </span>
                  </div>
                </div>
                <div className="postCenter" id="video-center">
                  <span className="video-desc">{s.snippet.description}</span>
                  <iframe
                    className="my-video-player"
                    title={s.id.videoId}
                    src={`https://www.youtube.com/embed/${s.id.videoId}`}
                  />
                </div>
              </div>
            </div>
          ))}

        {loading && generateSkeletons(5)}
      </List>
    </>
  );
};

export default Videos;
