import React, { useState, useContext, useEffect, useRef } from "react";
import "./friendRequest.css";
import { MoreHoriz } from "@mui/icons-material";
import { CircularProgress, Avatar } from "@mui/material";
import { arrayBufferToBase64 } from "../../base64Converter";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";

const FriendRequest = ({
  setFriendRequestBandage,
  socket,
  friendRequestPanelVisible,
  setFriendRequestPanelVisible,
}) => {
  const API = process.env.REACT_APP_API;
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friendReq, setFriendReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cnfLoading, setCnfLoading] = useState(false);
  const [canLoading, setCanLoading] = useState(false);

  const friendRequestContainerRef = useRef(null);

  useEffect(() => {
    const fetchFriendRq = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}users/friend-requests/${user._id}`);
        setFriendReq(res.data.friendRequests);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchFriendRq();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        friendRequestPanelVisible &&
        friendRequestContainerRef.current &&
        !friendRequestContainerRef.current.contains(event.target)
      ) {
        setFriendRequestPanelVisible(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [friendRequestPanelVisible, setFriendRequestPanelVisible]);

  const handleConfirm = async (f) => {
    setCnfLoading(true);
    try {
      const res = await axios.post(
        `${API}users/accept-friend-request/` + user._id,
        {
          friendId: f._id,
        }
      );
      const { notifications, bookmarks, ...userInfo } = res.data;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setFriendReq(res.data.friendRequests);
      setFriendRequestBandage(res.data?.friendRequests?.length);
      dispatch(UpdateUser(res.data));
      socket?.emit("Notification", { receiverId: f._id });
    } catch (error) {
      console.log(error);
    }
    setCnfLoading(false);
  };

  const handleDelete = async (f) => {
    setCanLoading(true);
    try {
      const res = await axios.post(
        `${API}users/reject-friend-request/` + user._id,
        {
          friendId: f._id,
        }
      );
      dispatch(UpdateUser(res.data));
      const { notifications, bookmarks, ...userInfo } = res.data;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setFriendReq(res.data.friendRequests);
      setFriendRequestBandage(res.data.friendRequests?.length);
    } catch (error) {
      console.log(error);
    }
    setCanLoading(false);
  };

  return (
    <div className="friendRequestContainer" ref={friendRequestContainerRef}>
      <div className="fr-wrapper">
        <div className="fr-title">
          <h3>Friend Requests</h3>
          <MoreHoriz className="fr-more" />
        </div>
        {friendReq?.map((f) => (
          <ul className="fr-list" key={f._id}>
            <li className="fr-list-item">
              <Link
                reloadDocument
                to={"/profile/" + f.username}
                className="fr-img-container"
              >
                <Avatar
                  className="fr-img"
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(
                    f?.profilePicture?.data
                  )}`}
                />
                <span className="fr-name">{f.username}</span>
              </Link>
              <div className="fr-btn-container">
                <button
                  className="fr-confirm"
                  onClick={() => handleConfirm(f)}
                  disabled={cnfLoading}
                >
                  {cnfLoading ? (
                    <CircularProgress color="inherit" size="15px" />
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  className="fr-delete"
                  onClick={() => handleDelete(f)}
                  disabled={canLoading}
                >
                  {canLoading ? (
                    <CircularProgress color="inherit" size="15px" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </li>
          </ul>
        ))}
        {loading ? (
          <div className="fr-loading">
            <CircularProgress />
          </div>
        ) : friendReq?.length === 0 ? (
          <div className="fr-loading">No request found</div>
        ) : null}
      </div>
    </div>
  );
};

export default FriendRequest;
