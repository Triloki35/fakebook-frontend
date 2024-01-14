import React, { useEffect, useRef, useState } from "react";
import "./receiver.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Call, CallEnd } from "@mui/icons-material";
import Peer from "simple-peer";

import * as process from "process";
import Timer from "../../timer/Timer";

const Receiver = ({ socket, callProp }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { call } = callProp;
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [mainVideo, setMainVideo] = useState(false);

  const ownVideoRef = useRef();
  const friendVideoRef = useRef();
  const audioRef = useRef();
  const peerRef = useRef(); // Add a ref to store the peer instance

  window.process = process;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: call.video, audio: call.audio })
      .then((currentStream) => {
        setStream(currentStream);
        ownVideoRef.current.srcObject = currentStream;

        // If the peer instance exists, replace the stream
        if (peerRef.current) {
          peerRef.current.replaceStream(currentStream);
        }
      });
  }, [call]);

  useEffect(() => {
    socket.on("endCall", () => {
      window.location.href = "/messenger";
    });
  }, [socket]);

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

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    // Store the peer instance in the ref
    peerRef.current = peer;

    peer?.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from._id });
    });

    peer?.on("stream", (currentStream) => {
      friendVideoRef.current.srcObject = currentStream;
    });

    peer?.on("close", () => {
      // Handle disconnection, e.g., set the call to not accepted
      setCallAccepted(false);
      setMainVideo(true);
      window.location.href = "/messenger";
    });

    peer?.on("error", (err) => {
      handleCallEnd();
    });

    peer?.signal(call.signal);
  };

  const handleCallEnd = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    socket.emit("endCall", { friendId: call?.from?._id });
    window.location.href = "/messenger";
  };

  return (
    <div className="receiverContainer">
      <div className="receiverWrapper">
        {(!callAccepted || !call.video) && (
          <div className="receiverTop">
            <img src={PF + call?.from.profilePicture} alt="" />
            <h4 style={!call.video ? { color: "black" } : {}}>{call?.from.username}</h4>
            {!callAccepted ? (
              <small style={!call.video ? { color: "black" } : {}}>
                {!call.video ? "Incoming call" : "Incoming video call"}
                <ScaleLoader color={!call.video ? "black" : "white"} height={3} width={3} />
              </small>
            ) : (
              <Timer />
            )}
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
        onClick={() => setMainVideo((prev) => !prev)}
      />

      {callAccepted && (
        <video
          className={mainVideo ? "mainVideo" : "secondaryVideo"}
          ref={friendVideoRef}
          autoPlay
          playsInline
          onClick={() => setMainVideo((prev) => !prev)}
        />
      )}

      <audio ref={audioRef} src={PF + "messenger-ringtone.mp3"} loop />
    </div>
  );
};

export default Receiver;
