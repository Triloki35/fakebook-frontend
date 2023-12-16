import React, { useRef, useEffect, useState, useContext } from "react";
import "./caller.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Call, CallEnd, Videocam, VideocamOff } from "@mui/icons-material";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import * as process from "process";

const Caller = ({ friend, socket }) => {
  const { user } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callProgress, setCallProgress] = useState(false);

  const ownVideoRef = useRef();
  const friendVideoRef = useRef();
  const connectionRef = useRef();
  const navigate = useNavigate();

  window.process = process;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        ownVideoRef.current.srcObject = currentStream;
      });
  }, []);

  useEffect(() => {
    socket.on("endCall", () => {
      console.log("endcall");
      window.location.href = "/messenger";
    });
  }, [socket]);

  const callUser = async () => {
    // console.log("incalluser");
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });
    // console.log(peer);

    peer?.on("signal", (data) => {
      // console.log(`in signal ${JSON.stringify(data)}`);
      socket?.emit("callUser", {
        friendId: friend._id,
        signal: data,
        from: user,
      });
    });

    peer?.on("stream", (currentStream) => {
      // console.log(`in stream ${JSON.stringify(currentStream)}`);
      friendVideoRef.current.srcObject = currentStream;
    });

    socket?.on("callAccepted", (signal) => {
      // console.log(`callAccepted ${JSON.stringify(signal)}`);
      setCallAccepted(true);
      setCallProgress(false);
      peer?.signal(signal);
    });
  };

  const handleCallEnd = () => {
    socket.emit("endCall", { friendId: friend._id });
    window.location.href = "/messenger";
  };

  // console.log(friendVideoRef);

  return (
    <div className="callerContainer">
      <div className="callerWrapper">
        {!callAccepted && (
          <div className="callerTop">
            <img src={PF + friend.profilePicture} alt="" />
            <h4>{friend.username}</h4>
            {callProgress && (
              <small>
                Ringing
                <ScaleLoader height={3} width={3} color="white"/>
              </small>
            )}
          </div>
        )}

        <div className={callAccepted ? "callerbottom" : "callerbottom2"}>
          {!callAccepted ? (
            <>
              <button
                className="callBtn"
                onClick={() => {
                  callUser();
                  setCallProgress(true);
                }}
              >
                <Videocam htmlColor="white" /> <span>&nbsp;Call</span>
              </button>
              <button className="abortBtn" onClick={() => handleCallEnd()}>
                <VideocamOff htmlColor="white" /> <span>&nbsp; Abort</span>
              </button>
            </>
          ) : (
            <button className="endBtn" onClick={() => handleCallEnd()}>
              <CallEnd htmlColor="white" />
            </button>
          )}
        </div>
      </div>

      <video
        className={callAccepted ? "secondaryVideo" : "mainVideo"}
        ref={ownVideoRef}
        autoPlay
        playsInline
        muted
      />

      {callAccepted && (
        <video
          className={callAccepted ? "mainVideo" : "secondaryVideo"}
          ref={friendVideoRef}
          autoPlay
          playsInline
        />
      )}
    </div>
  );
};

export default Caller;
