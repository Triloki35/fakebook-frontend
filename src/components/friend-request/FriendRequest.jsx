import React, { useState, useContext } from "react";
import "./friendRequest.css";
import { MoreHoriz } from "@mui/icons-material";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";
import { Avatar, CircularProgress } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";

const FriendRequest = ({ setFriendRequestBandage }) => {
  const API = process.env.REACT_APP_API;
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friendReq, setFriendReq] = useState([]);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    const fetchFriendRq = async () => {
      isLoading(true);
      try {
        const res = await axios.get(`${API}users?userId=${user._id}`);
        console.log(res.data);
        setFriendReq(res.data.friendRequests);
        await dispatch(UpdateUser(res.data));
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        console.log(user);
      } catch (error) {
        console.log(error);
      }
      isLoading(false);
    };
    fetchFriendRq();
  }, []);

  const handleConfirm = async (f) => {
    try {
      const res = await axios.post(`${API}users/accept-friend-request/` + user._id, {
        friendId: f._id,
      });
      // console.log(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setFriendReq(res.data.friendRequests);
      setFriendRequestBandage(res.data.friendRequests.length);
      dispatch(UpdateUser(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (f) => {
    try {
      const res = await axios.post(`${API}users/reject-friend-request/` + user._id, {
        friendId: f._id,
      });
      console.log(res.data);
      dispatch(UpdateUser(res.data));
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setFriendReq(res.data.friendRequests);
      setFriendRequestBandage(res.data.friendRequests.length);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(user);

  return (
    <div className="friendRequestContainer">
      <div className="fr-wrapper">
        <div className="fr-title">
          <h3>Friend Requests</h3>
          <MoreHoriz className="fr-more" />
        </div>
        {friendReq?.map((f) => (
          <ul className="fr-list">
            <li className="fr-list-item">
              <Link
                reloadDocument
                to={"/profile/" + f.username}
                className="fr-img-container"
              >
                <Avatar className="fr-img" src={`data:image/jpeg;base64,${arrayBufferToBase64(f?.profilePicture?.data)}`}/>
                <span className="fr-name">{f.username}</span>
              </Link>
              <div className="fr-btn-container">
                <button className="fr-confirm" onClick={() => handleConfirm(f)}>
                  Confirm
                </button>
                <button className="fr-delete" onClick={() => handleDelete(f)}>
                  Delete
                </button>
              </div>
            </li>
          </ul>
        ))}
        {loading ? (
          <div className="fr-loading">
            <CircularProgress />
          </div>
        ) : (
          friendReq.length === 0 && (
            <div className="fr-loading">No request found</div>
          )
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
