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
        {user?.city}
      </li>
      <li className="rightBarInfoItems">
        <LocationOn style={{ marginRight: "5px", color: "gray" }} /> <b>From</b>
        &nbsp;
        {user?.from}
      </li>
      <li className="rightBarInfoItems">
        <Favorite style={{ marginRight: "5px", color: "gray" }} />
        {user?.relationship}
      </li>
    </ul>
    </>
  )
}

export default ProfileDetails