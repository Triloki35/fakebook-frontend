import React, { useState } from "react";
import "./events.css";
import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  Skeleton,
  TextField,
} from "@mui/material";
import axios from "axios";
import CountrySelect from "../news/CountrySelect";
import { Link } from "react-router-dom";

const Events = ({ setEvents }) => {
  const API = process.env.REACT_APP_API;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const getEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}search/search-events/${query}/${country}`
      );
      setSearchResult(res.data);
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
          <Skeleton variant="rounded" style={{ width: "100%" }} height={150} />
        </ListItem>
      );
    }

    return skeletons;
  };

  const formatDate = (startDate) => {
    const date = new Date(`${startDate} ${new Date().getFullYear()}`);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
  };

  console.log(searchResult);

  return (
    <Grid>
      <div className="news-search">
        <div className="nw-top">
          <ArrowBack
            onClick={() => setEvents(false)}
            style={{ marginRight: "10px" }}
          />
          <TextField
            id="standard-basic"
            label="Search event's"
            variant="standard"
            style={{ width: "-webkit-fill-available" }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            style={{ height: "30px" }}
            onClick={getEvents}
          >
            Search
          </Button>
        </div>
        <div className="ev-bottom">
          <CountrySelect setCountry={setCountry}/>
        </div>
      </div>

      <List>
        {searchResult &&
          searchResult.map((s, index) => (
            <ListItem key={index} className="events-list-item" id="ev-list" divider={true}>
              <div className="ev-left">
                <h1>{formatDate(s.date.start_date).day}</h1>
                <span>{formatDate(s.date.start_date).month}</span>
              </div>

              <div className="ev-center">
                <span>{s.title}</span>
                <small>{s.date.when}</small>
                <small>{s.address[0]}</small>
                <Link className="news-link" to={s.link}>Book now</Link>
              </div>

              <div className="ev-right">
                <Avatar
                  variant="rounded"
                  alt="Events"
                  src={s.image}
                  sx={{ height: 100, width: 100 }}
                />
              </div>
            </ListItem>
          ))}

        {loading && generateSkeletons(5)}
      </List>
    </Grid>
  );
};

export default Events;
