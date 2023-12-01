import React from "react";
import "./usersModal.css";
import { Cancel } from "@mui/icons-material";
import User from "./user/User";

const UsersModal = ({ setShowUsersModal, users }) => {
  return (
    <div className="likeModalContainer">
      <div className="likeModalWrapper">
        <div className="lm-top">
          <span className="lm-top-title">All</span>
          <span
            className="lm-top-btn"
            onClick={() => setShowUsersModal((prev) => !prev)}
          >
            <Cancel />
          </span>
        </div>
        <div className="lm-bottom-wrapper">
          {users && users.length === 0 ? (
            <p>No user found</p>
          ) : (
            users.map((userId) => <User key={userId} userId={userId} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
