import React, { useState, useEffect, useContext } from "react";
import "./friendsuggestion.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Suggestion from "./suggestion/Suggestion";
import SuggestionSkeletonList from "./SuggestionSkeletonList";

function FriendSuggestions({socket}) {
  const API = process.env.REACT_APP_API;
  const { user } = useContext(AuthContext);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      let dont = [];
      try {
        setLoading(true);
        const res1 = await axios.get(
          `${API}users/friend-requests/${user._id}`
        );
        // const res1 = await axios.get(
        //   `http://localhost:8000/api/users/friend-requests/${user._id}`
        // );
        

        const friendRequestIds = res1.data.friendRequests.map((fr) => fr._id);
        // console.log(friendRequestIds);
        dont = [
          ...user.friends,
          ...user.sentRequest,
          ...friendRequestIds,
          user._id,
        ];
        const res2 = await axios.get(`${API}users/friendsuggestion`, {
          params: { dont },
        });
        // const res2 = await axios.get(`http://localhost:8000/api/users/friendsuggestion`, {
        //   params: { dont },
        // });
        setSuggestions(res2.data);
        // intializing loadingStaes
        const initialLoadingStates = {};
        res2.data.forEach((suggestion) => {
          initialLoadingStates[suggestion._id] = false;
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);


  return (
    <div className="suggestionContainer">
      <div className="fr-title">
        <h3>Friend Suggestions</h3>
        <MoreHoriz className="fr-more" />
      </div>
      <div className="suggestionListContainer">
        <ul className="suggestionList">
        {suggestions.length === 0 ? (<SuggestionSkeletonList/>) : suggestions.map((s,i) => (
            <Suggestion key={i} suggestion={s} setSuggestions={setSuggestions} socket={socket}/>
          ))}
          
        </ul>
      </div>
      {loading && (
        <ul className="suggestionProgress">
          <CircularProgress color="inherit" setSuggestions={setSuggestions}/>
        </ul>
      )}
    </div>
  );
}

export default FriendSuggestions;
