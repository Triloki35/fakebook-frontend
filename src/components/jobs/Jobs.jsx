import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./jobs.css";
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Skeleton,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccessTime, ArrowBack, Home, Launch, Work } from "@mui/icons-material";
import { format } from "timeago.js";
import ClipLoader from "react-spinners/ClipLoader";

function Jobs({ setJobs }) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const KEY = process.env.REACT_APP_JSEARCH_KEY;

  const searchJob = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: query,
        page: 1,
        num_pages: "20",
      },
      headers: {
        "X-RapidAPI-Key": KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };
    try {
      const res = await axios.request(options);
      setSearchResult(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateSkeletons = (count) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      skeletons.push(
        <ListItem key={i} style={{ marginBottom: "10px" }}>
          <Skeleton variant="circular" width={60} height={50} />
          <Skeleton
            variant="rounded"
            width={370}
            height={80}
            style={{ marginLeft: "20px" }}
          />
        </ListItem>
      );
    }

    return skeletons;
  };

  console.log(searchResult);
  console.log(KEY);

  return (
    <Grid className="jobs-container" container direction="column" rowGap={2}>
      <div className="job-search-container">
        <ArrowBack className="job-back-btn" onClick={() => setJobs(false)} />
        <TextField
          style={{ width: "400px" }}
          id="standard-basic"
          label="Search jobs"
          variant="standard"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="contained"
          size="small"
          style={{ height: "30px" }}
          onClick={() => {
            setSearchResult([]);
            searchJob();
          }}
        >
          {loading ? (
            <ClipLoader size={15} color={"white"} loading={true} speedMultiplier={2} />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {searchResult &&
          searchResult.map((s, index) => (
            <ListItem key={index} divider={true}>
              <ListItemAvatar sx={{ marginBottom: "50px" }}>
                <Avatar src={s.employer_logo} alt={s.employer_name}/>
              </ListItemAvatar>

              <div className="job-list-text-container">
                <div className="jbtc-up">
                  <span className="roleName">{s.job_title}</span>
                  <span className="companyName">{s.employer_name}</span>
                  <small className="place">
                    {!s.job_is_remote &&
                      `${s.job_city} ${s.job_state} ${s.job_country}`}
                  </small>
                  <small className="from">{s.job_publisher}</small>
                </div>
                <div className="jbtc-down">
                  <small className="jb-time">
                    <AccessTime fontSize="small" />{" "}
                    {format(s.job_posted_at_datetime_utc)}
                  </small>
                  <small className="jb-type">
                    <Work fontSize="small" /> {s.job_employment_type}
                  </small>
                  {s.job_is_remote && (
                    <small className="jb-remote">
                      <Home fontSize="small" /> Remote
                    </small>
                  )}
                </div>
              </div>

              <Link className="job-link" to={s.job_apply_link}>
                <Launch />
              </Link>
            </ListItem>
          ))}

        {loading && generateSkeletons(5)}
      </List>
    </Grid>
  );
}

export default Jobs;
