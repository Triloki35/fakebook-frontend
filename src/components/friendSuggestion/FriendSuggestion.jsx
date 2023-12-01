import React, { useState, useEffect, useRef, useContext } from "react";
import "./friendsuggestion.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Suggestion from "./suggestion/Suggestion";

function FriendSuggestions() {
  const { user } = useContext(AuthContext);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  

  

  useEffect(() => {
    const fetchSuggestions = async () => {
      let dont = [];
      try {
        setLoading(true);
        const res1 = await axios.get(`/users?userId=${user._id}`);
        const friendRequestIds = res1.data.friendRequests.map((fr) => fr._id);
        // console.log(friendRequestIds);
        dont = [
          ...res1.data.friends,
          ...user.sentRequest,
          ...friendRequestIds,
          user._id,
        ];
        const res2 = await axios.get(`/users/friendsuggestion`, {
          params: { dont },
        });
        setSuggestions(res2.data);
        // intializing loadingStaes
        const initialLoadingStates = {};
        res2.data.forEach((suggestion) => {
          initialLoadingStates[suggestion._id] = false;
        });
        setLoadingStates(initialLoadingStates);
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
          {suggestions.map((s) => (
            <Suggestion suggestion={s} setSuggestions={setSuggestions} setLoadingStates={setLoadingStates} loadingStates={loadingStates}/>
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
