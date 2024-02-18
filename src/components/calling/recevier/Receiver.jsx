import React, { useEffect, useRef, useState } from "react";
import "./receiver.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Call, CallEnd, Mic, MicOff, Videocam, VideocamOff, VolumeMute, VolumeUp } from "@mui/icons-material";
import Peer from "simple-peer";
import { arrayBufferToBase64 } from "../../../base64Converter";
import * as process from "process";
import Timer from "../../timer/Timer";
import { Avatar, IconButton } from "@mui/material";
import axios from "axios";

const Receiver = ({ socket, callProp }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const { call } = callProp;
  const [stream, setStream] = useState(null);
  const [friendProfilePic , setFriendProfilePic] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [mainVideo, setMainVideo] = useState(false);
  const [mute, setMute] = useState(call.audio);
  const [videoOn, setVideoOn] = useState(call.video);
  const [speaker, setSpeaker] = useState(false);

  const ownVideoRef = useRef();
  const friendVideoRef = useRef();
  const audioRef = useRef();
  const peerRef = useRef(); 

  window.process = process;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API}users?userId=${call?.from?._id}`);
        // const res = await axios.get(`http://localhost:8000/api/users?userId=${call?.from?._id}`);
        setFriendProfilePic(res.data.profilePicture);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [call]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoOn, audio: mute })
      .then((currentStream) => {
        setStream(currentStream);
        ownVideoRef.current.srcObject = currentStream;

        if (peerRef.current) {
          peerRef.current.replaceStream(currentStream);
        }
      });
  }, [call]);

  useEffect(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      const audioElement = audioRef.current;
      const deviceId = speaker ? "default" : "communications";
  
      // Check if setSinkId method is available
      if ('sinkId' in audioElement) {
        audioTracks.forEach(track => {
          track.applyConstraints({ deviceId: { exact: deviceId } })
            .then(() => {
              // Set the sinkId to change the audio output device
              audioElement.setSinkId(deviceId)
                .then(() => {
                  console.log(`Audio output device set to ${deviceId}`);
                })
                .catch(error => {
                  console.error('Error setting audio output device:', error);
                });
            })
            .catch(error => {
              console.error('Error applying constraints:', error);
            });
        });
      } else {
        console.error('setSinkId is not supported in your browser');
      }
    }
  }, [speaker]);
  

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

    peerRef.current = peer;

    peer?.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from._id });
    });

    peer?.on("stream", (currentStream) => {
      friendVideoRef.current.srcObject = currentStream;
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


  const handleToggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled; // Toggle the enabled state of each audio track
      });
      setMute((prevMute) => !prevMute); // Toggle the mute state
    }
  };

  const handleToggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled; // Toggle the enabled state of each video track
      });
      setVideoOn((prevVideoOn) => !prevVideoOn); // Toggle the video state
    }
  };

  const handleSpeaker = () => {
    setSpeaker(prevSpeaker => !prevSpeaker);
  };
  

  console.log(callProp);

  return (
    <div className="receiverContainer">
      <div className="receiverWrapper">
        {(!callAccepted || !call.video) && (
          <div className="receiverTop">
            <Avatar src={`data:image/jpeg;base64,${arrayBufferToBase64(friendProfilePic?.data)}`} />
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
        {callAccepted ? (
          <div className={call.video ? "rcv-controls" : "rcv-controls2"}>
              <IconButton onClick={()=>handleToggleMute()}>
                {mute ? (
                  <Mic htmlColor="white" />
                ) : (
                  <MicOff htmlColor="white" />
                )}
              </IconButton>
              <IconButton onClick={()=> handleCallEnd()}>
                <CallEnd color="error" />
              </IconButton>
              {call.video ? (
                <IconButton onClick={() => handleToggleVideo()}>
                  {videoOn ? (
                    <Videocam htmlColor="white" />
                  ) : (
                    <VideocamOff htmlColor="white" />
                  )}
                </IconButton>
              ) : (
                <IconButton onClick={() => handleSpeaker()}>
                  {speaker ? (
                    <VolumeUp htmlColor="white" />
                  ) : (
                    <VolumeMute htmlColor="white" />
                  )}
                </IconButton>
              )}
            </div>
        ) : (
          <div className="receiverBottom2">
          <button className="rb-end" onClick={() => handleCallEnd()}>
            <CallEnd htmlColor="white" />
          </button>
            <button className="rb-ans" onClick={() => answerCall()}>
              <Call htmlColor="white" />
            </button>
        </div>
        )}
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

      <audio ref={audioRef} src={PF + 'messenger-ringtone.mp3'} loop />

    </div>
  );
};

export default Receiver;
