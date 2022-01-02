import React from "react";
import "./Home.css";
import Left from "./../../Components/LeftSideBar/Left";
import Feeds from "./../../Components/Feeds/Feeds";
import Right from "./../../Components/RightBar/Right";

function Home({ socket, onlineUsers }) {
  return (
    <>
      <div className="homeContainer">
        <Left socket={socket} />
        <Feeds socket={socket} />
        <Right socket={socket} onlineUsers={onlineUsers} />
      </div>
    </>
  );
}

export default Home;
