import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./Pages/Homepage/Home";
import Profile from "./Pages/ProfilePage/Profile";
import Login from "./Pages/LoginPage/Login";
import Register from "./Pages/RegisterPage/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./ContextApi/UserContext/UserContext";
import Messenger from "./Pages/Messenger/Messenger";
import Settings from "./Pages/Profile Setting/Settings";
import Navbar from "./Components/Navbar/Navbar";
import { io } from "socket.io-client";
import SavedPost from "./Pages/SavedPostPage/SavedPost";
import VideoPage from "./Pages/VideoPage/VideoPage";

function App() {
  const { user } = useContext(userContext);
  const [close, setClose] = useState(false);
  const [socket, setSocket] = useState(null);

  //on app render, initilize socket connection
  useEffect(() => {
    setSocket(io("ws://localhost:8800", { transports: ["websocket"] }));
  }, []);

  const [onlineUsers, setOnlineUsers] = useState([]);

  //getting online users
  useEffect(() => {
    socket?.emit("addUser", user?._id);
    socket?.on("users", (users) => {
      setOnlineUsers(users);
    });
  }, [socket, user?._id]);

  return (
    <Router>
      {!user ? null : (
        <Navbar close={close} setClose={setClose} socket={socket} />
      )}
      <div className="App" onClick={() => setClose(true)}>
        <Switch>
          <Route exact path="/">
            {!user ? (
              <Redirect to="/login" />
            ) : (
              <Home socket={socket} onlineUsers={onlineUsers} />
            )}
          </Route>
          <Route path="/profile">
            {!user ? <Redirect to="/login" /> : <Profile socket={socket} />}
          </Route>
          <Route path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
          <Route path="/messenger">
            {!user ? (
              <Redirect to="/register" />
            ) : (
              <Messenger socket={socket} onlineUsers={onlineUsers} />
            )}
          </Route>
          <Route path="/settings">
            {!user ? <Redirect to="/register" /> : <Settings />}
          </Route>
          <Route path="/savedPosts">
            {!user ? <Redirect to="/register" /> : <SavedPost />}
          </Route>
          <Route path="/videos">
            {!user ? (
              <Redirect to="/register" />
            ) : (
              <VideoPage socket={socket} />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
