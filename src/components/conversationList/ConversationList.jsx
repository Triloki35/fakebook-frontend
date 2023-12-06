import React from "react";
import axios from "axios";
import "./conversationList.css"
import SearchFriend from "../search-friend/SearchFriend";
import OnlineFriend from "../onlineFriend/OnlineFriend";
import History from "../../components/history/History";
import ClipLoader from "react-spinners/ClipLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
// Import necessary material-ui components/icons

const ConversationList = ({
  user,
  communitiesProp,
  setCurrentConversation,
  setMessengerCenterVisible,
  conversation,
  isMobile,
  markAllSeen,
  onlineUsers,
}) => {
  const { communities, setCommunities } = communitiesProp;
  
  console.log(conversation);

  return (
    <div className="conversation">
      <div className="conversationTop">
        <div className="ConversationTitle">
          <h1>Chats</h1>
        </div>
        <SearchFriend
          userId={user._id}
          setCurrentConversation={setCurrentConversation}
          setMessengerCenterVisible={setMessengerCenterVisible}
        />
        <div className="onlineFriendList">
          <OnlineFriend
            user={user}
            onlineUsers={onlineUsers}
            setCurrentConversation={setCurrentConversation}
            setMessengerCenterVisible={setMessengerCenterVisible}
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
          <div>
            {conversation ? (
              conversation.length === 0 ? (
                <div className="no-convo">
                <h3>No conversation found</h3>
                <p>Start a conversation by searching for friends!</p>
                </div>
              ) : (
                conversation?.map((c, index) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setCurrentConversation(c.conversation);
                      isMobile && setMessengerCenterVisible(true);
                      markAllSeen(c.conversation._id);
                    }}
                    className={
                      index === conversation.length - 1 ? "last-child" : ""
                    }
                  >
                    <History
                      conversation={c.conversation}
                      lastMessage={c.lastMessage}
                      curruser={user}
                      key={c._id}
                    />
                  </div>
                ))
              )
            ) : (
              <div className="messenger-loader">
                <ClipLoader
                  color={"#1877F2"}
                  loading={true}
                  speedMultiplier={2}
                />
              </div>
            )}
          </div>
        ) : (
          <h3 className="communities-title">
            Coming soon
            <ScaleLoader color="gray" height={20} width={5} />
          </h3>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
