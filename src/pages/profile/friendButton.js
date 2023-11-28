// FriendButton.js

import React from 'react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const FriendButton = ({ isFriend, isRequested, isAsked, handleClick }) => {
  const iconStyle = { marginRight: '10px' };
  const setButtomText = () => {
    if(isFriend){
        return "unfriend";
    }else if(isRequested){
        return "Cancel request";
    }else if(isAsked){
        return "Confirm";
    }else{
        return "Add Friend";
    }
  }
  const buttonText = setButtomText();

  return (
    <button className={`btn ${isFriend || isRequested ? 'unfriendBtn' : 'friendBtn'}`} onClick={handleClick}>
      {(isFriend || isRequested) && <PersonRemoveIcon style={iconStyle} />}
      {!isFriend && !isRequested && <PersonAddAlt1Icon style={iconStyle} />}
      {buttonText}
    </button>
  );
};

export default FriendButton;
