import React, { useEffect, useState, useContext } from "react";
import "./profile.css";
import axios from "axios";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import ProfileEdit from "../../components/profileEdit/ProfileEdit";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";
import FriendButton from "./friendButton";

export default function Profile({socket, unseenProp}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currUser, dispatch } = useContext(AuthContext);
  const { username } = useParams();
  const [user, setUser] = useState(null);

  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isAsked, setIsAsked] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {unseen,setUnseen} = unseenProp;
  
  // fetching unseen msg from db
  useEffect(() => {
    const fetchUnseenMsg = async() => {
      try {
        console.log(currUser);
        const res = await axios.get(`/conversations/unseen/${currUser._id}`);
        console.log(res.data);
        setUnseen(res.data.totalUnseenCount);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUnseenMsg();
  }, [currUser])

    // real time addon
    useEffect(() => {
      socket?.on("getMsg", (data) => {
        setUnseen((prev)=>prev+1);
      });
    }, [socket])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (user) {
      // console.log(user);
      setIsFriend(currUser.friends.includes(user._id));
      setIsRequested(currUser.sentRequest.includes(user._id));
      setIsAsked(currUser.friendRequests.some((rq)=>rq._id === user._id));
    }
  }, [user, currUser]);

  const handleClick = async () => {
    // make change in local storage
    if (isFriend) {
      try {
        const res = await axios.post(`/users/unfriend/${currUser._id}`, {
          _id: user._id,
        });
        dispatch(UpdateUser(res.data));
        setIsFriend(false);
      } catch (error) {
        console.log(error);
      }
    } else if (isRequested) {
      try {
        const res = await axios.post(
          `/users/cancel-friend-request/${currUser._id}`,
          { _id: user._id }
        );
        setIsRequested(false);
        dispatch(UpdateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    }else if(isAsked){
      try {
        const res = await axios.post("/users/accept-friend-request/" + currUser._id, {
          friendId: user._id,
        });
        setIsAsked(false);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        dispatch(UpdateUser(res.data));
      } catch (error) {
        console.log(error);
      }
    } 
    else {
      try {
        const reqbody = {
          _id: currUser._id,
          profilePicture: currUser.profilePicture,
          username: currUser.username,
        };
        const res = await axios.post(
          `/users/friend-request/${user._id}`,
          reqbody
        );
        // console.log(res.data);
        dispatch(UpdateUser(res.data));
        setIsRequested(true);
      } catch (error) {
        console.log(error);
      }
    }
    localStorage.setItem("userInfo", JSON.stringify(currUser));
  };

  // Edit
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  console.log("isFriend : " + isFriend);
  console.log("isRequested : " + isRequested);
  console.log("isAsked : " + isAsked);
  console.log(currUser);

  return (
    <>
      <Topbar unseen={unseen} />
      <div className="profileContainer">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="coverContainer">
              <img
                className="coverPic"
                src={
                  user?.coverPicture
                    ? PF + user.coverPicture
                    : `${PF}person/cover-picture/default-coverpic.jpeg`
                }
                alt=""
              />
              <img
                className="profilePic"
                src={
                  user?.profilePicture
                    ? PF + user.profilePicture
                    : `${PF}person/profile-picture/default-profilepic.png`
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileName">{user?.username}</h4>
              <span className="profileDesc">{user?.desc}</span>

              {currUser._id !== user?._id ? (
                <FriendButton
                  isFriend={isFriend}
                  isRequested={isRequested}
                  isAsked={isAsked}
                  handleClick={handleClick}
                />
              ) : (
                <>
                  <button className="btn editBtn" onClick={handleEdit}>
                    <Edit /> &nbsp;Edit profile
                  </button>
                  <ProfileEdit
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                  />
                </>
              )}
            </div>
          </div>
          <div className="profileRightBottom">
            <div className="profileRightBottomLeft">
              <Feed username={username} />
            </div>
            <div className="profileRightBottomRight">
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
