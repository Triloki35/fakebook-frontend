import React, { useState, useEffect, useRef, useContext } from "react";
import "./friendsuggestion.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { MoreHoriz } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";

function FriendSuggestions() {
  const { user, dispatch } = useContext(AuthContext);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchSuggestions = async () => {
      let dont = [];
      try {
        setLoading(true);
        const res1 = await axios.get(`/users?userId=${user._id}`);
        const friendRequestIds = res1.data.friendRequests.map((fr) => fr._id);
        // console.log(friendRequestIds);
        dont = [...res1.data.friends, ...user.sentRequest, ...friendRequestIds, user._id];
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

  const SendRequest = async (userId) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [userId]: true,
    }));
    try {
      const reqbody = {
        _id: user._id,
        profilePicture: user.profilePicture,
        username: user.username,
      };
      const res = await axios.post(`/users/friend-request/${userId}`, reqbody);
      // updating
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((suggestion) => suggestion._id !== userId)
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      dispatch(UpdateUser(res.data));
    } catch (error) {
      console.log(error);
    }
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [userId]: true,
    }));
  };

  const removeFromSuggestion = async (id) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [id]: true,
    }));
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion._id !== id)
    );
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [id]: true,
    }));
  };

  return (
    <div className="suggestionContainer">
      <div className="fr-title">
        <h3>Friend Suggestions</h3>
        <MoreHoriz className="fr-more" />
      </div>
      <div className="suggestionListContainer">
        <ul className="suggestionList">
          {suggestions.map((s) => (
            <li key={s._id}>
              <Link
                to={`/profile/${s.username}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="fs-wrapper">
                  <img
                    src={
                      s.profilePicture
                        ? PF + s.profilePicture
                        : PF + "person/profile-picture/default-profilepic.png"
                    }
                    alt=""
                  />
                  <span>{s.username.split(" ")[0]}</span>
                </div>
              </Link>
              <div className="fs-btn-container">
                <button
                  className="fs-confirm"
                  onClick={() => SendRequest(s._id)}
                  disabled={loadingStates[s._id]}
                >
                  {!loadingStates[s._id] ? (
                    "Add Friend"
                  ) : (
                    <CircularProgress color="inherit" size="15px" />
                  )}
                </button>
                <button
                  className="fs-delete"
                  onClick={() => removeFromSuggestion(s._id)}
                  disabled={loadingStates[s._id]}
                >
                  {!loadingStates[s._id] ? (
                    "Remove"
                  ) : (
                    <CircularProgress color="primary" size="15px" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {loading && (
        <div className="suggestionProgress">
          <CircularProgress color="inherit" />
        </div>
      )}
    </div>
  );
}

export default FriendSuggestions;
