import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import SearchIcon from "@mui/icons-material/Search";
import History from "../../components/history/History";
import Chatbar from "../../components/chatbar/Chatbar";
import Chat from "../../components/chat/Chat";
import OnlineFriend from "../../components/onlineFriend/OnlineFriend";
import Reply from "../../components/reply/Reply";
import { AuthContext } from "../../context/AuthContext";
import SearchFriend from "../../components/search-friend/SearchFriend";

const Messenger = ({ socket, onlineUsers }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messengerCenterVisible, setMessengerCenterVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [communities, setCommunities] = useState(false); 
  const [conversation, setConversation] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [message, setMessage] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [friend, setFriend] = useState(null);
  const scrollRef = useRef();

  const messengerLeft = {
    flex: "3.5",
    borderRight: "1px solid #e8e1e1db",
  }

  const messengerLeftMobileVisible = {
    flex:12,
    border:"none"
  }

  const messengerLeftMobileInvisible = {
    display:"none",
  }

  const messengerCenter = {
    flex: "8.5",
  }

  const messengerCenterMobileInvisible = {
    display:"none",
  }

  const messengerCenterMobilevisible = {
    flex:12,
  }

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

  

  // socket receive event
  useEffect(() => {
    socket?.on("getMsg", (data) => {
      console.log("Message received:", data);
      const newArrivalMsg = {
        conversationId: currentConversation?._id,
        senderId: data.senderId,
        text: data.text,
      };
      setArrivalMessage(newArrivalMsg);
    });
  }, [socket]);
  


  useEffect(() => {
    arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.senderId) &&
      setMessage((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // fetching conversationID
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversation(res.data);
      } catch (error) {}
    };
    getConversation();
  }, [user]);

  // get messages
  useEffect(() => {
    const getMsg = async () => {
      try {
        const res = await axios.get("/messages/" + currentConversation?._id);
        setMessage(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMsg();
  }, [currentConversation]);

  // fetching friendId
  useEffect(() => {
    const friendId = currentConversation?.members.filter(
      (id) => user._id !== id
    );
    const getFriend = async (friendId) => {
      if (friendId) {
        try {
          const res = await axios.get(`/users?userId=${friendId}`);
          setFriend(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getFriend(friendId);
  }, [currentConversation]);

  // to set scroll bar
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  return (
    <>
      <Topbar />

      <div className="messenger">
        <div style={isMobile ? ( messengerCenterVisible ? messengerLeftMobileInvisible : messengerLeftMobileVisible) : messengerLeft}>
          <div className="messengerLeftWrapper">
            <div className="conversation">

              <div className="conversationTop">
                <div className="ConversationTitle">
                  <h1>Chats</h1>
                </div>
                <SearchFriend />
                <div className="onlineFriendList">
                  <OnlineFriend
                    user={user}
                    onlineUsers={onlineUsers}
                    setCurrentConversation={setCurrentConversation}
                  />
                </div>
              </div>

              <div className="conversationBottom">
                <button
                  className={communities ? "toggleBtn" : "activeBtn"}
                  onClick={() => setCommunities(!communities)}
                >
                  Inbox
                </button>
                <button
                  className={communities ? "activeBtn" : "toggleBtn"}
                  onClick={() => setCommunities(!communities)}
                >
                  Communities
                </button>
                {!communities ? (
                  <>
                    {conversation.map((c) => (
                      <div onClick={() => {setCurrentConversation(c);setMessengerCenterVisible(true) }}>
                        <History conversation={c} curruser={user} key={c._id} />
                      </div>
                    ))}
                  </>
                ) : (<h3 className="communities-title">Coming soon...</h3>)}
              </div>
            </div>
          </div>
        </div>

        <div style={isMobile  ? (messengerCenterVisible ? messengerCenterMobilevisible : messengerCenterMobileInvisible) : messengerCenter}>
          <div className="messengerCenterWrapper">
            {currentConversation && <Chatbar friend={friend} isMobile={isMobile} setMessengerCenterVisible={setMessengerCenterVisible}/>}

            <div className="chatBoxWrapper" ref={scrollRef}>
              {currentConversation ? (
                message!==null ? (
                  message.map((m) => (
                    <div ref={scrollRef}>
                      <Chat
                        message={m}
                        own={user._id === m.senderId}
                        friend={friend}
                        key={m._id}
                      />
                    </div>
                  ))
                ) : (
                  <span>Say hi to your new Fakebook friend...</span>
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
