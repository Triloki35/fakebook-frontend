import { Delete, Key, Settings } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";

const AccountSettings = ({ setSetting, userId }) => {
  const API = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handlePasswordChange = () => {
    navigate("/recover");
  };

  const handleDeleteAccount = async () => {
    try {
    //   const response = await axios.delete(
    //     "http://localhost:8000/api/users/delete-user",
    //     {
    //       data: { userId },
    //     }
    //   );
        const response = await axios.delete(`${API}users/delete-user`, {
          data: { userId },
        });

      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      //   console.error("An error occurred:", error);
      setError(error.response.data.error);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <li onClick={() => setSetting(false)}>
        <Settings /> <span>Settings</span>
      </li>
      <li onClick={handlePasswordChange}>
        <Key /> <span>Change Password</span>
      </li>
      <li onClick={handleDeleteAccount}>
        <Delete htmlColor="#ff0e0e" />
        <span style={{ color: "#ff0e0e" }}>Delete Account</span>
      </li>
    </>
  );
};

export default AccountSettings;
