import React ,{useEffect , useState }from 'react';
import "./onlineFriend.css";
import axios from 'axios';
import { fetchFriendList } from '../../apiCalls';

const OnlineFriend = ({user , onlineUsers, setCurrentConversation, setMessengerCenterVisible}) => {
  
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API = process.env.REACT_APP_API;
  const [friendList, setFriendList] = useState([]);
  const [activeFriend,setActiveFriend] = useState([]);

  // getting friendList of user 
  useEffect(() => {
    const getFriend = async (user) => {
      try {
        const res = await fetchFriendList(user);
        setFriendList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getFriend(user);
  }, [user])

  // getting OnlineFriend
  useEffect(() => {
    const res = friendList.filter((friend) => {
      return onlineUsers.some((onlineUser) => onlineUser.userId === friend._id);
    });
    setActiveFriend(res);
  }, [friendList,onlineUsers])

  const handleClick = async(friend) => {
    try {
      const res = await axios.get(`${API}conversations/find/${user._id}/${friend._id}`);
      setCurrentConversation(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  // console.log(friendList);
  // console.log(onlineUsers);
  // console.log(activeFriend);
  
  return (
    <>
      {activeFriend.map((f) => (
        <div className="onlineFriend" key={f._id} onClick={()=>{handleClick(f);setMessengerCenterVisible((prev)=>!prev)}}>
          <div className="onlineFriendContainer">
            <img
              className="onlineFriendImg"
              src={user ? PF + f.profilePicture : PF + "person/profile-pic/10.jpeg"}
              alt=""
            />
            <span className="onlineSymbool"></span>
            <span className="onlineFriendName">
              {user && f.username }
            </span>
          </div>
        </div>
      ))}
    </>
  );


}
export default OnlineFriend;
