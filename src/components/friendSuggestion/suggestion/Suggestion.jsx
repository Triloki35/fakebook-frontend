import React, { useContext, useState, useEffect } from "react";
import "./suggestion.css";
import { Link } from "react-router-dom";
import { Alert, Avatar, CircularProgress } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { UpdateUser } from "../../../context/AuthActions";
import UsersModal from "../../showUserModal/UsersModal";
import { arrayBufferToBase64 } from "../../../services/base64Converter";

const Suggestion = ({
  suggestion,
  setSuggestions,
  socket,
}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { user, dispatch } = useContext(AuthContext);

  const [showUsersModal, setShowUsersModal] = useState(false);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [sucess,setSucess] = useState(null);
  const [error,setError] = useState(null);

  useEffect(() => {
    const fetchtMutualFriends = async () => {
      try {
        const res = await axios.get(
          `${API}users/mutual-friends/${user._id}/${suggestion._id}`
        );
        setMutualFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchtMutualFriends();
  }, [suggestion]);

  const SendRequest = async (userId) => {
    setLoadingAdd(true);
    try {
      const reqbody = {
        _id: user._id,
        username: user.username,
      };
      const res = await axios.post(
        `${API}users/friend-request/${userId}`,
        reqbody
      );
      // const res = await axios.post(
      //   `http://localhost:8000/api/users/friend-request/${userId}`,
      //   reqbody
      // );
      setSucess(res.data.message);
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((suggestion) => suggestion._id !== userId)
      );
      socket.emit("send-friendRequest", { userId: userId });
      const { notifications, bookmarks, ...userInfo } = res.data.sender;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      dispatch(UpdateUser(res.data.sender));
    } catch (error) {
      console.log(error);
      setError("Failed to send friend request. Please try again later.");
    }
    setLoadingAdd(false);
  };

  const removeFromSuggestion = async (id) => {
    setLoadingRemove(true);
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion._id !== id)
    );
    setLoadingRemove(false);
  };

  return (
    <li key={suggestion._id}>
      <div className="fs-wrapper">
        <Link
          to={`/profile/${suggestion.username}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <Avatar
            src={`data:image/jpeg;base64,${arrayBufferToBase64(
              suggestion?.profilePicture?.data
            )}`}
            sx={{ marginRight: "10px", width:"50px",height:"50px"}}
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
          disabled={loadingAdd}
        >
          {!loadingAdd ? (
            "Add"
          ) : (
            <CircularProgress color="inherit" size="15px" />
          )}
        </button>
        <button
          className="fs-delete"
          onClick={() => removeFromSuggestion(suggestion._id)}
          disabled={loadingRemove}
        >
          {!loadingRemove ? (
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
      { sucess && (
        <Alert className="sugesstion-alert" severity="success" onClose={() => setSucess(null)}>
          {sucess}
        </Alert>
      )}

      {error && (
        <Alert className="sugesstion-alert" severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </li>
  );
};

export default Suggestion;
