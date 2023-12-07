import React from "react";
import "./usersModal.css";
import { Cancel } from "@mui/icons-material";
import User from "./user/User";

const LikeModal = ({setShowUsersModal,users}) => {
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
  )
}

const TagModel = ({setShowUsersModal,setIstag,istag,users}) => {
  console.log("here");
  console.log(users);
  return (
    (
      <div className="likeModalContainer">
        <div className="likeModalWrapper">
          <div className="lm-top">
            <span className="lm-top-title">All</span>
            <span
              className="lm-top-btn"
              onClick={() => {setShowUsersModal((prev) => !prev);setIstag((prev)=>!prev)}}
            >
              <Cancel />
            </span>
          </div>
          <div className="lm-bottom-wrapper">
            {users?.length === 0 ? (
              <p>No user found</p>
            ) : (
              users?.map((user) => <User key={user._id} user={user} istag={istag}/>)
            )}
          </div>
        </div>
        </div>
    )
  )
}

const UsersModal = ({ setShowUsersModal, istag, setIstag, users }) => {
  console.log(istag);
  console.log(users);
  return (<>
    {!istag ? (
      <LikeModal setShowUsersModal={setShowUsersModal} users={users} />
    ) : (
      <TagModel setShowUsersModal={setShowUsersModal} setIstag={setIstag} istag={istag} users={users} />
    )}
  </>
    
  );
};

export default UsersModal;
