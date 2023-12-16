import React, { useEffect, useRef, useState } from "react";
import "./receiver.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Call, CallEnd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";

import * as process from "process";
import Timer from "../../timer/Timer";

const Receiver = ({ socket, callProp }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { call, setCall } = callProp;
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [mainVideo,setMainVideo] = useState(false);


  const ownVideoRef = useRef();
  const friendVideoRef = useRef();
  const audioRef = useRef();
  const connectionRef = useRef();
  const navigate = useNavigate();

  // window.global = window;
  window.process = process;
  // window.Buffer = [];


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: call.video, audio: call.audio })
      .then((currentStream) => {
        setStream(currentStream);
        ownVideoRef.current.srcObject = currentStream;
      });
  }, [call]);

  useEffect(()=>{
    socket.on("endCall",()=>{
      console.log("endcall");
      window.location.href = "/messenger";
    })
  },[socket])

  useEffect(() => {
    if (callAccepted) {
      stopRingtone();
    } else {
      playRingtone();
    }
  }, [callAccepted]);

  const playRingtone = () => {
    audioRef.current.play();
  };

  const stopRingtone = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setMainVideo(true);

    const peer = new Peer({ initiator: false, trickle: false, stream:stream });

    peer?.on("signal", (data) => {
      console.log(`in signal ${data}`);
      socket.emit("answerCall", { signal: data, to: call.from._id });
    });

    peer?.on("stream", (currentStream) => {
      console.log(`in stream ${currentStream}`);
      friendVideoRef.current.srcObject = currentStream;
    });

    peer?.on('error', (err) => {
      console.log(err);
      handleCallEnd();
    })

    peer?.signal(call.signal);
  };

  const handleCallEnd = () => {
    socket.emit("endCall", { friendId: call?.from?._id });
    window.location.href = "/messenger";
  };

  // console.log(friendVideoRef);

  // console.log("Audio = "+ call.audio);
  // console.log("Video = "+ call.video);

  return (
    <div className="receiverContainer">
      <div className="receiverWrapper">
        {(!callAccepted || !call.video) && (
          <div className="receiverTop">
            <img src={PF + call?.from.profilePicture} alt="" />
            <h4 style={!call.video ? {color:"black"} : {}}>{call?.from.username}</h4>
            {!callAccepted ? <small style={!call.video ? {color:"black"} : {}}>
              {!call.video ? "Incoming call" : "Incoming video call"}
              <ScaleLoader color={!call.video ?"black":"white"} height={3} width={3} />
            </small> : <Timer/> }
          </div>
        )}
        <div className={callAccepted ? "receiverBottom" : "receiverBottom2"}>
          <button className="rb-end" onClick={() => handleCallEnd()}>
            <CallEnd htmlColor="white" />
          </button>
          {!callAccepted && (
            <button className="rb-ans" onClick={() => answerCall()}>
              <Call htmlColor="white" />
            </button>
          )}
        </div>
      </div>

      <video
        className={mainVideo ? "secondaryVideo" : "mainVideo"}
        ref={ownVideoRef}
        autoPlay
        playsInline
        muted
        onClick={()=>setMainVideo((prev)=>!prev)}
      />

      {callAccepted && (
        <video
          className={mainVideo ? "mainVideo" : "secondaryVideo"}
          ref={friendVideoRef}
          autoPlay
          playsInline
          onClick={()=>setMainVideo((prev)=>!prev)}
        />
      )}

      <audio ref={audioRef} src={PF+"messenger-ringtone.mp3"} loop />
    </div>
  );
};

export default Receiver;
