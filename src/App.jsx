import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import { AuthContext } from "./context/AuthContext";
import { io } from "socket.io-client";
import Call from "./pages/call/Call";

export default function App() {
  let { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unseen, setUnseen] = useState(0);
  const [call, setCall] = useState(null);

  const unseenProp = {unseen , setUnseen};
  const callProp ={call , setCall};

  useEffect(() => {
    if(user){
      const newSocket = io("ws://localhost:8800");
      setSocket(newSocket);

      newSocket.emit("addUser", user._id);

       newSocket.on("getUser", (users) => {
        //  console.log(users);
         setOnlineUsers(users);
       });
    }
  }, [user])  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={user ? <Home socket={socket} unseenProp={unseenProp} callProp={callProp}/> : <Login />} />
        <Route exact path="/login" element={user ? <Home socket={socket} unseenProp={unseenProp} callProp={callProp}/> : <Login />} />
        <Route exact path="/register" element={user ? <Home socket={socket} unseenProp={unseenProp} callProp={callProp}/> : <Register />} />
        <Route exact path="/messenger" element={user ? <Messenger socket={socket} onlineUsers={onlineUsers} unseenProp={unseenProp} callProp={callProp}/> : <Login />} />
        <Route exact path="/profile/:username" element={<Profile socket={socket} unseenProp={unseenProp} callProp={callProp}/>} />
        <Route exact path="/call" element={<Call socket={socket} callProp={callProp}/>} />
      </Routes>
    </BrowserRouter>
  );
}
