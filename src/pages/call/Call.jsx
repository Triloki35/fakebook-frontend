import React from 'react';
import { useLocation } from 'react-router-dom';
import './call.css';
import Caller from '../../components/calling/caller/Caller';
import Receiver from '../../components/calling/recevier/Receiver';

const Call = ({ socket, callProp }) => {
  const location = useLocation();
  const caller = new URLSearchParams(location.search).get('caller') === 'true';

  // console.log(socket);
  // console.log(onlineUsers);
  // console.log(friend);

  return <>{caller ? <Caller friend={location?.state.friend} audio={location?.state.audio} video={location?.state.video} socket={socket}/> : <Receiver socket={socket} callProp={callProp}/> }</>;
};

export default Call;
