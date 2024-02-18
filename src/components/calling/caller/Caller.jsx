import React, { useRef, useEffect, useState, useContext } from "react";
import "./caller.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import {
  Call,
  CallEnd,
  Mic,
  MicNone,
  MicOff,
  PhoneDisabled,
  Speaker,
  Videocam,
  VideocamOff,
  VolumeMute,
  VolumeUp,
} from "@mui/icons-material";
import Peer from "simple-peer";
import { AuthContext } from "../../../context/AuthContext";
import * as process from "process";
import Timer from "../../timer/Timer";
import { Avatar, Button, IconButton } from "@mui/material";
import { arrayBufferToBase64 } from "../../../base64Converter";

const Caller = ({ friend, socket, audio, video }) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callProgress, setCallProgress] = useState(false);
  const [mainVideo, setMainVideo] = useState(false);
  const [mute, setMute] = useState(audio);
  const [videoOn, setVideoOn] = useState(video);
  const [speaker, setSpeaker] = useState(false);

  const ownVideoRef = useRef();
  const friendVideoRef = useRef();
  const peerRef = useRef();

  window.process = process;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoOn, audio: mute })
      .then((currentStream) => {
        setStream(currentStream);
        ownVideoRef.current.srcObject = currentStream;
      });
  }, []);

  useEffect(() => {
    if (stream) {
      peerRef?.current?.replaceStream(stream);
    }
  }, [stream]);

  useEffect(() => {
    socket.on("endCall", () => {
      window.location.href = "/messenger";
    });
  }, [socket]);

  const callUser = async () => {
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    peerRef.current = peer;

    peer?.on("signal", (data) => {
      socket?.emit("callUser", {
        friendId: friend._id,
        signal: data,
        from: { _id: user._id, username: user.username },
        audio: audio,
        video: video,
      });
    });

    peer?.on("stream", (currentStream) => {
      friendVideoRef.current.srcObject = currentStream;
    });

    socket?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setCallProgress(false);
      setMainVideo(true);
      peer?.signal(signal);
    });
  };

  // Inside your Caller component
  const handleToggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMute((prevMute) => !prevMute);
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

  const handleCallEnd = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    socket.emit("endCall", { friendId: friend._id });
    window.location.href = "/messenger";
  };

  const handleSpeaker = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      const audioElement = ownVideoRef.current;
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
        // Toggle the speaker state
        setSpeaker(prevSpeaker => !prevSpeaker);
      } else {
        console.error('setSinkId is not supported in your browser');
      }
    }
  };
  

  return (
    <div className="callerContainer">
      <div className="callerWrapper">
        {(!callAccepted || !video) && (
          <div className="callerTop">
            <Avatar
              src={`data:image/jpeg;base64,${arrayBufferToBase64(
                friend?.profilePicture?.data
              )}`}
            />
            <h4 style={!video ? { color: "black" } : {}}>{friend?.username}</h4>
            {callProgress && (
              <small style={!video ? { color: "black" } : {}}>
                Ringing
                <ScaleLoader
                  height={3}
                  width={3}
                  color={!video ? "black" : "white"}
                />
              </small>
            )}
            {!callProgress && !video && callAccepted && <Timer />}
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
                {!video ? (
                  <Call htmlColor="white" />
                ) : (
                  <Videocam htmlColor="white" />
                )}
                <span>&nbsp; Call</span>
              </button>
              <button className="abortBtn" onClick={() => handleCallEnd()}>
                {!video ? (
                  <PhoneDisabled htmlColor="white" />
                ) : (
                  <VideocamOff htmlColor="white" />
                )}{" "}
                <span>&nbsp; Abort</span>
              </button>
            </>
          ) : (
            <div className={video ? "controls" : "controls2"}>
              <IconButton onClick={() => handleToggleMute()}>
                {mute ? (
                  <Mic htmlColor="white" />
                ) : (
                  <MicOff htmlColor="white" />
                )}
              </IconButton>
              <IconButton onClick={() => handleCallEnd()}>
                <CallEnd color="error" />
              </IconButton>

              {video ? (
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
    </div>
  );
};

export default Caller;
