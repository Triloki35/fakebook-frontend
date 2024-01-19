import React, { useState, useEffect, useContext } from "react";
import "./profileEdit.css";
import { Cancel, Favorite, Home, LocationOn } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Alert } from "@mui/material";

export default function ProfileEdit({ isOpen, onClose, onChange }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { user } = useContext(AuthContext);

  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [profilePicEdit, setProfilePicEdit] = useState(false);

  const [selectedCoverPic, setSelectedCoverPic] = useState(null);
  const [coverPicEdit, setCoverPicEdit] = useState(false);

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAbout, setEditedAbout] = useState({
    city: user.city,
    from: user.from,
    relationship: user.relationship,
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.desc);

  const [error, setError] = useState(null);

  const profilePicChange = (e) => {
    setSelectedProfilePic(e.target.files[0]);
    setProfilePicEdit(true);
  };

  const ProfilePicSave = async () => {
    if (!selectedProfilePic) {
      console.error("No profile picture selected.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedProfilePic);
    formData.append("_id", user._id);

    try {
      const res = await axios.post(`${API}users/uploadProfilePic`, formData);
      // const res = await axios.post(
      //   `http://localhost:8000/api/users/uploadProfilePic`,
      //   formData
      // );
      console.log("Post uploaded successfully:", res.data);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.profilePicture = res.data.profilePicture;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      setError("Error uploading profile picture");
    }
    setProfilePicEdit(false);
  };

  const coverPicChange = (e) => {
    setSelectedCoverPic(e.target.files[0]);
    setCoverPicEdit(true);
  };

  const CoverPicSave = async () => {
    if (!selectedCoverPic) {
      console.error("No Cover picture selected.");
      return;
    }

    const formData = new FormData();
    formData.append("coverPicture", selectedCoverPic);
    formData.append("_id", user._id);

    try {
      // const res = await axios.post(`${API}users/uploadCoverPic`, formData);
      const res = await axios.post(`http://localhost:8000/api/users/uploadCoverPic`, formData);
      // console.log("Post uploaded successfully:", res.data);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.coverPicture = res.data.coverPicture;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      setError("Error uploading cover picture");
    }

    setCoverPicEdit(false);
  };

  const handleEditAbout = () => {
    setIsEditingAbout(true);
  };

  const handleSaveAbout = async () => {
    const aboutData = {
      city: editedAbout.city,
      from: editedAbout.from,
      relationship: editedAbout.relationship,
      _id: user._id,
    };

    try {
      const res = await axios.post(`${API}users/updateAbout`, aboutData);
      console.log("About updated successfully:", res.data);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.city = res.data.city;
      userInfo.from = res.data.from;
      userInfo.relationship = res.data.relationship;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      setError("Error uploading about");
    }

    setIsEditingAbout(false);
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    try {
      const res = await axios.post(`${API}users/updateDesc`, {
        desc: editedBio,
        _id: user._id,
      });
      console.log(res.data);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.desc = res.data.desc;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      setError("Error uploading about");
    }

    setIsEditingBio(false);
  };

  return (
    <div className={`edit-container ${isOpen ? "open" : ""}`}>
      <div className="edit-wrapper">
        <div className="edit-top">
          <h4>Edit Profile</h4>
          <button onClick={onClose}>
            <Cancel />
          </button>
        </div>
        <hr className="hr-style" />
        <div className="edit-bottom">
          <div className="edit-bottom-wrapper">
            <div className="edit-header">
              <h4>Profile Picture</h4>
              {profilePicEdit ? (
                <div className="edit-buttons profile-buttons">
                  <button className="save" onClick={ProfilePicSave}>
                    Save
                  </button>
                  <button
                    className="cancel"
                    onClick={() => {
                      setProfilePicEdit(false);
                      setSelectedProfilePic(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <label htmlFor="profilePictureInput" className="edit-label">
                  Edit
                </label>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={profilePicChange}
                id="profilePictureInput"
                style={{ display: "none" }}
              />
            </div>
            <div className="edit-body profile-body">
              {selectedProfilePic ? (
                <img
                  className="profile-picture"
                  src={URL.createObjectURL(selectedProfilePic)}
                  alt="Selected Profile"
                />
              ) : (
                <img
                  className="profile-picture"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : `${PF}person/profile-picture/default-profilepic.png`
                  }
                  alt=""
                />
              )}
            </div>
          </div>

          <div className="edit-bottom-wrapper">
            <div className="edit-header">
              <h4>Cover Picture</h4>
              {coverPicEdit ? (
                <div className="edit-buttons">
                  <button className="save" onClick={CoverPicSave}>
                    Save
                  </button>
                  <button
                    className="cancel"
                    onClick={() => {
                      setCoverPicEdit(false);
                      setSelectedCoverPic(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <label htmlFor="coverPictureInput" className="edit-label">
                  Edit
                </label>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={coverPicChange}
                id="coverPictureInput"
                style={{ display: "none" }}
              />
            </div>
            <div className="edit-body edit-cover-pic">
              {selectedCoverPic ? (
                <img
                  className="cover-picture"
                  src={URL.createObjectURL(selectedCoverPic)}
                  alt="Selected Cover"
                />
              ) : (
                <img
                  className="cover-picture"
                  src={
                    user.coverPicture
                      ? PF + user.coverPicture
                      : `${PF}person/cover-picture/default-coverpic.jpeg`
                  }
                  alt=""
                />
              )}
            </div>
          </div>

          <div className="edit-bottom-wrapper">
            <div className="edit-header">
              <h4>About</h4>
              {isEditingAbout ? (
                <div className="edit-buttons">
                  <button className="save" onClick={handleSaveAbout}>
                    Save
                  </button>
                  <button
                    className="cancel"
                    onClick={() => setIsEditingAbout(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={handleEditAbout}>Edit</button>
              )}
            </div>
            <div className="edit-body" id="about-body">
              {isEditingAbout ? (
                <form style={{ display: "flex", flexDirection: "column" }}>
                  <label>
                    Lives in:
                    <input
                      className="about-input"
                      type="text"
                      name="location"
                      value={editedAbout.city}
                      onChange={(e) =>
                        setEditedAbout({
                          ...editedAbout,
                          city: e.target.value,
                        })
                      }
                      autoFocus
                      style={{ marginRight: "10px" }}
                    />
                  </label>
                  <label>
                    From:
                    <input
                      className="about-input"
                      type="text"
                      name="origin"
                      value={editedAbout.from}
                      onChange={(e) =>
                        setEditedAbout({
                          ...editedAbout,
                          from: e.target.value,
                        })
                      }
                      autoFocus
                    />
                  </label>
                  <label>
                    Relationship Status:
                    <select
                      className="about-input"
                      name="relationshipStatus"
                      value={editedAbout.relationship}
                      onChange={(e) =>
                        setEditedAbout({
                          ...editedAbout,
                          relationship: e.target.value,
                        })
                      }
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Committed">Committed</option>
                    </select>
                  </label>
                </form>
              ) : (
                <ul>
                  <li className="aboutList">
                    <Home className="icon" /> Lives in &nbsp;{" "}
                    <b>{editedAbout.city}</b>
                  </li>
                  <li className="aboutList">
                    <LocationOn className="icon" /> From &nbsp;{" "}
                    <b>{editedAbout.from}</b>
                  </li>
                  <li className="aboutList">
                    <Favorite className="icon" /> {editedAbout.relationship}
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="edit-bottom-wrapper">
            <div className="edit-header">
              <h4>Bio</h4>
              {isEditingBio ? (
                <div className="edit-buttons">
                  <button className="save" onClick={handleSaveBio}>
                    Save
                  </button>
                  <button
                    className="cancel"
                    onClick={() => setIsEditingBio(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={handleEditBio}>Edit</button>
              )}
            </div>
            <div className="edit-body">
              {isEditingBio ? (
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows="4"
                  className="bio-textarea"
                />
              ) : (
                <p style={{ textAlign: "center", color: "gray" }}>
                  {editedBio}
                </p>
              )}
            </div>
          </div>
        </div>
        <hr className="hr-style" />
        <div className="close-btn-con">
          <button
            className="close-btn"
            onClick={() => window.location.reload()}
          >
            Close
          </button>
        </div>
        {error && (
            <Alert className="profile-edit-error" severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
      </div>
    </div>
  );
}
