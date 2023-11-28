import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import { AuthContext } from "./context/AuthContext";
import { io } from "socket.io-client";

export default function App() {
  let { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if(user){
      const newSocket = io("ws://localhost:8800");
      setSocket(newSocket);

      newSocket.emit("addUser", user._id);

       newSocket.on("getUser", (users) => {
         console.log(users);
         setOnlineUsers(users);
       });
    }
  }, [user])
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={user ? <Home socket={socket} /> : <Login />} />
        <Route exact path="/login" element={user ? <Home socket={socket}/> : <Login />} />
        <Route exact path="/register" element={user ? <Home socket={socket}/> : <Register />} />
        <Route exact path="/messenger" element={user ? <Messenger socket={socket} onlineUsers={onlineUsers}/> : <Login />} />
        <Route exact path="/profile/:username" element={<Profile socket={socket}/>} />
      </Routes>
    </BrowserRouter>
  );
}
