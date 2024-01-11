import React, { useEffect, useState } from "react";
import "./user.css";
import axios from "axios";
import { Link } from "react-router-dom";

const LikedUser = ({userId}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}users?userId=${userId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <Link
      to={`/profile/${user?.username}`}
      style={{ textDecoration: "none" }}
      className="lm-bottom"
    >
      <img
        className="lm-bottom-img"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : `${PF}person/profile-picture/default-profilepic.png`
        }
        alt=""
      />
      <div className="lmb-nameContainer">
        <span>{user?.username}</span>
        {/* <small>5 mutual friends</small> */}
      </div>
    </Link>
  );
}

const TagedUser = ({user}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link
      to={`/profile/${user?.username}`}
      style={{ textDecoration: "none" }}
      className="lm-bottom"
    >
      <img
        className="lm-bottom-img"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : `${PF}person/profile-picture/default-profilepic.png`
        }
        alt=""
      />
      <div className="lmb-nameContainer">
        <span>{user?.username}</span>
        {/* <small>5 mutual friends</small> */}
      </div>
    </Link>
  );

}



const User = ({ userId , user, istag}) => {
  console.log("istag"+istag);
  console.log(user);
  return (
    <>
      {istag ? <TagedUser user={user} /> : <LikedUser userId={userId}/>}
    </>
  );
};

export default User;
