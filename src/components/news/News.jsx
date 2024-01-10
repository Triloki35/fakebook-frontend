import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CountrySelect from "./CountrySelect";
import Categories from "./Categories";
import "./news.css";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";

const News = ({setNews}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState(null);

  const KEY = process.env.REACT_APP_NEWS_KEY;

  const getNews = async () => {
    setLoading(true);
    try {
      const newsApiParams = {
        country: country.toLowerCase(),
        category: category.toLowerCase(),
        apiKey: KEY,
        q: query,
      };

      const res = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: newsApiParams,
      });

      setArticles(res.data.articles);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };


  const generateSkeletons = (count) => {
    const skeletons = [];

    for (let i = 0; i < count; i++) {
      skeletons.push(
        <ListItem>
          <Skeleton variant="rounded" style={{width:"100%"}} height={150} />
        </ListItem>
      );
    }

    return skeletons;
  };
  // console.log(news[0]);

  // console.log(category);
  // console.log(country);
  // console.log(query);
  // console.log(KEY);

  return (
    <Grid>
      <div className="news-search">
        <div className="nw-top">
          <ArrowBack onClick={()=>setNews(false)} style={{marginRight:"10px"}}/>
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
          <Categories setCategory={setCategory} />
        </div>
      </div>

      <List>
        {articles &&
          articles.map((a,index) => (
            <ListItem key={index} className="news-list-item" divider={true}>
              <div className="nw-left">
                <Avatar
                  variant="rounded"
                  alt="News"
                  src={a.urlToImage}
                  sx={{ height: 100, width: 100 }}
                />
              </div>
              <div className="nw-right">
                <span>{a.title}</span>
                <small>
                  {a.description}
                </small>
                <Link className="news-link" to={a.url}>
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
