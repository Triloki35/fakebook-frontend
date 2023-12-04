import React, { useContext, useState, useEffect } from "react";
import "./suggestion.css";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { UpdateUser } from "../../../context/AuthActions";
import UsersModal from "../../showUserModal/UsersModal";

const Suggestion = ({
  suggestion,
  setSuggestions,
  setLoadingStates,
  loadingStates,
  socket
}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch } = useContext(AuthContext);

  const [showUsersModal, setShowUsersModal] = useState(false);
  const [mutualFriends, setMutualFriends] = useState([]);

  useEffect(() => {
    const fetchtMutualFriends = async () => {
      try {
        const res = await axios.get(
          `/users/mutual-friends/${user._id}/${suggestion._id}`
        );
        console.log(res.data);
        setMutualFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchtMutualFriends();
  }, [suggestion]);

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
      socket.emit("send-friendRequest",{  userId:userId });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      dispatch(UpdateUser(res.data));
    } catch (error) {
      console.log(error);
    }
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [userId]: false,
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
      [id]: false,
    }));
  };

  return (
    <li key={suggestion._id}>
      <div className="fs-wrapper">
        <Link
          to={`/profile/${suggestion.username}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <img
            src={
              suggestion.profilePicture
                ? PF + suggestion.profilePicture
                : PF + "person/profile-picture/default-profilepic.png"
            }
            alt=""
          />
        </Link>

        <div className="fs-userInfo">
          <span>{suggestion.username.split(" ").slice(0, 2).join(" ")}</span>
          <small onClick={() => setShowUsersModal(!showUsersModal)}>
            {mutualFriends.length !== 0 &&
              mutualFriends.length + " mutual friends"}
          </small>
        </div>
      </div>

      <div className="fs-btn-container">
        <button
          className="fs-confirm"
          onClick={() => SendRequest(suggestion._id)}
          disabled={loadingStates[suggestion._id]}
        >
          {!loadingStates[suggestion._id] ? (
            "Add"
          ) : (
            <CircularProgress color="inherit" size="15px" />
          )}
        </button>
        <button
          className="fs-delete"
          onClick={() => removeFromSuggestion(suggestion._id)}
          disabled={loadingStates[suggestion._id]}
        >
          {!loadingStates[suggestion._id] ? (
            "Remove"
          ) : (
            <CircularProgress color="primary" size="15px" />
          )}
        </button>
      </div>
      {showUsersModal && (
        <UsersModal
          setShowUsersModal={setShowUsersModal}
          users={mutualFriends}
        />
      )}
    </li>
  );
};

export default Suggestion;
