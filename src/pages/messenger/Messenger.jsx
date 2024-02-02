import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Chatbar from "../../components/chatbar/Chatbar";
import Chat from "../../components/chat/Chat";
import Reply from "../../components/reply/Reply";
import { AuthContext } from "../../context/AuthContext";
import { WavingHand } from "@mui/icons-material";
import ConversationList from "../../components/conversationList/ConversationList";
import { useNavigate } from "react-router-dom";

const Messenger = ({ socket, onlineUsers, unseenProp, callProp }) => {
  const API = process.env.REACT_APP_API;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messengerCenterVisible, setMessengerCenterVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [communities, setCommunities] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [message, setMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [friend, setFriend] = useState(null);
  const scrollRef = useRef();
  const { unseen, setUnseen } = unseenProp;
  const {setCall} = callProp;
  const navigate = useNavigate();

  // css
  const messengerLeft = {
    flex: "3.5",
    borderRight: "1px solid #e8e1e1db",
  };

  const messengerLeftMobileVisible = {
    flex: 12,
    border: "none",
  };

  const messengerLeftMobileInvisible = {
    display: "none",
  };

  const messengerCenter = {
    flex: "8.5",
    height: "calc(100vh - 50px)",
  };

  const messengerCenterMobileInvisible = {
    display: "none",
  };

  const messengerCenterMobilevisible = {
    flex: 12,
  };

  // unseen msg fetching from db
  useEffect(() => {
    const fetchUnseenMsg = async () => {
      try {
        const res = await axios.get(`${API}conversations/unseen/${user._id}`);
        console.log(res.data);
        setUnseen(res.data.totalUnseenCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnseenMsg();
  }, [user, currentConversation]);

  // fetching  all conversation
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(`${API}conversations/` + user._id);
        setConversation(res.data);
      } catch (error) {}
    };
    getConversation();
  }, [user]);

  // fetching friendId
  useEffect(() => {
    const friendId = currentConversation?.members.filter(
      (id) => user._id !== id
    );
    const getFriend = async (friendId) => {
      if (friendId) {
        try {
          const res = await axios.get(`${API}users?userId=${friendId}`);
          // const res = await axios.get(`http://localhost:8000/api/users?userId=${friendId}`);
          setFriend(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getFriend(friendId);
  }, [currentConversation, user]);

  // get messages
  useEffect(() => {
    const getMsg = async () => {
      try {
        const res = await axios.get(`${API}messages/` + currentConversation?._id, {
          userId: user._id,
        });
        // const res = await axios.get(`http://localhost:8000/api/messages/` + currentConversation?._id, {
        //   userId: user._id,
        // });
        setMessage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMsg();
  }, [currentConversation, user]);

  // mark last msg seen
  const markAllSeen = async (conversationId) => {
    try {
      const res = await axios.put(`${API}messages/${conversationId}/seen`, {
        userId: user._id,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // socket receive event
  useEffect(() => {
    socket?.on("getMsg", (data) => {
      // console.log("Message received:", data);
      setArrivalMessage(data);
      if (currentConversation?.members.includes(data.senderId)) {
        setUnseen((prev) => prev - 1);
      }
    });

    socket?.on('callUser', ({ from, signal, audio , video }) => {
      // console.log("recived call");
      // console.log("Audio = "+audio);
      // console.log("Video = "+video);
      setCall({ from, signal, audio:audio, video:video });
      navigate("/call");
    });
  }, [socket]);

  // pushing arrival msg into msg
  useEffect(() => {
    if (
      arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.senderId)
    ) {
      setMessage((prev) => [...prev, arrivalMessage]);
      const markSeen = async () => {
        try {
          const res = await axios.put(
            `${API}messages/seenByText/${arrivalMessage.text}`,
            { userId: user._id, senderId: arrivalMessage.senderId }
          );
        } catch (error) {
          console.log(error);
        }
      };
      markSeen();
    }
  }, [arrivalMessage]);

  // tracking screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // scrool to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [message]);

  console.log(conversation);

  return (
    <>
      <Topbar unseen={unseen} />

      <div className="messenger">
        <div
          style={
            isMobile
              ? messengerCenterVisible
                ? messengerLeftMobileInvisible
                : messengerLeftMobileVisible
              : messengerLeft
          }
        >
          <div className="messengerLeftWrapper">
            <ConversationList
              user={user}
              communitiesProp={{ communities, setCommunities }}
              setCurrentConversation={setCurrentConversation}
              setMessengerCenterVisible={setMessengerCenterVisible}
              conversation={conversation}
              isMobile={isMobile}
              markAllSeen={markAllSeen}
              onlineUsers={onlineUsers}
            />
          </div>
        </div>

        <div
          style={
            isMobile
              ? messengerCenterVisible
                ? messengerCenterMobilevisible
                : messengerCenterMobileInvisible
              : messengerCenter
          }
        >
          <div className="messengerCenterWrapper">
            {currentConversation && (
              <Chatbar
                friend={friend}
                isMobile={isMobile}
                setMessengerCenterVisible={setMessengerCenterVisible}
              />
            )}
            {/* here i am displaying message of particular conversation */}
            <div className="chatBoxWrapper" ref={scrollRef}>
              {currentConversation ? (
                message.length !== 0 ? (
                  message.map((m) => (
                    <div>
                      <Chat
                        message={m}
                        own={user._id === m.senderId}
                        friend={friend}
                        key={m._id}
                      />
                    </div>
                  ))
                ) : (
                  <span className="greeting">
                    Say hi to your new Fakebook friend.
                    <WavingHand htmlColor="goldenrod" />
                  </span>
                )
              ) : (
                <span className="noConversation">
                  Open a conversation to start chat...
                </span>
              )}
            </div>

            {currentConversation && (
              <Reply
                user={user}
                currentConversation={currentConversation}
                message={message}
                setMessage={setMessage}
                socket={socket}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
