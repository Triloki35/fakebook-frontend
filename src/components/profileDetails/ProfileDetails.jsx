import React from 'react';
import "./profileDetails.css";
import { Favorite, Home, LocationOn } from '@mui/icons-material'

const ProfileDetails = ({user}) => {
  return (
    <>
    <h4 className="rightBarTitle">User Information</h4>
    <ul className="rightBarInfo">
      <li className="rightBarInfoItems">
        <Home style={{ marginRight: "5px", color: "gray" }} /> <b>Lives in</b> &nbsp;
        <b>{user?.city}</b>
      </li>
      <li className="rightBarInfoItems">
        <LocationOn style={{ marginRight: "5px", color: "gray" }} /> <b>From</b>
        &nbsp;
        <b>{user?.from}</b>
      </li>
      <li className="rightBarInfoItems">
        <Favorite style={{ marginRight: "5px", color: "gray" }} />
        <b>{user?.relationship}</b>
      </li>
    </ul>
    </>
  )
}

export default ProfileDetails