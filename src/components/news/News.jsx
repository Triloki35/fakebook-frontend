import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CountrySelect from "./CountrySelect";
import Categories from "./Categories";
import "./news.css";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";

const News = ({ setNews }) => {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState(null);

  const API = process.env.REACT_APP_API;

  const getNews = async () => {
    setLoading(true);
    try {
      const params = {
        query: query,
        country: country,
      };
      const res = await axios.get(
        `${API}search/search-news`,
        {
          params: params
        }
      );

      // const res = await axios.get(
      //   `http://localhost:8000/api/search/search-news`,
      //   {
      //     params: params,
      //   }
      // );
      // console.log(res.data);
      setArticles(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getNews();
  }, [])
  

  const generateSkeletons = (count) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      skeletons.push(
        <ListItem>
          <Skeleton variant="rounded" style={{ width: "100%" }} height={150} />
        </ListItem>
      );
    }

    return skeletons;
  };

  return (
    <Grid>
      <div className="news-search">
        <div className="nw-top">
          <ArrowBack
            onClick={() => setNews(false)}
            style={{ marginRight: "10px" }}
          />
          <TextField
            id="standard-basic"
            label="keywords"
            variant="standard"
            style={{ width: "-webkit-fill-available" }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            style={{ height: "30px" }}
            onClick={getNews}
          >
            Get
          </Button>
        </div>
        <div className="nw-bottom">
          <CountrySelect setCountry={setCountry} />
        </div>
      </div>

      <List>
        {articles &&
          articles.map((a, index) => (
            <ListItem key={index} className="news-list-item" divider={true}>
              <div className="nw-left">
                <Avatar
                  variant="rounded"
                  alt="News"
                  src={a?.thumbnail || a?.highlight?.thumbnail || a?.stories?.[0]?.thumbnail}
                  sx={{ height: 100, width: 100 }}
                />
              </div>
              <div className="nw-right">
                <span>{a.title || a?.highlight?.title || a?.stories?.[0]?.title}</span>
                <Link className="news-link" to={a.link || a?.highlight?.link || a?.stories?.[0]?.link}>
                  read full article
                </Link>
              </div>
            </ListItem>
          ))}

        {loading && generateSkeletons(5)}
      </List>
    </Grid>
  );
};

export default News;
