import React, { useEffect, useState } from "react";
import "./user.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Avatar, Skeleton } from "@mui/material";
import { arrayBufferToBase64 } from "../../../services/base64Converter";

const LikedUser = ({userId}) => {
  const API = process.env.REACT_APP_API;
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}users?userId=${userId}`);
        // const res = await axios.get(`http://localhost:8000/api/users?userId=${userId}`);
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
      <Avatar className="lm-bottom-img" src={`data:image/jpeg;base64,${arrayBufferToBase64(user?.profilePicture?.data)}`}/>
      <div className="lmb-nameContainer">
        {user?.username ? <span>{user?.username}</span> : <Skeleton variant="text" sx={{ height:"30px" ,width:"100px"}} />}
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
      <Avatar className="lm-bottom-img" src={`data:image/jpeg;base64,${arrayBufferToBase64(user?.profilePicture?.data)}`} />
      <div className="lmb-nameContainer">
        <span>{user?.username}</span>
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
