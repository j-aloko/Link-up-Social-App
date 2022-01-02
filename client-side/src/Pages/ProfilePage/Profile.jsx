import React, { useEffect } from "react";
import Left from "../../Components/LeftSideBar/Left";
import "./Profile.css";
import Body from "./../../Components/ProfileBody/Body";

function Profile({ socket }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="profileContainer">
        <Left />
        <Body socket={socket} />
      </div>
    </>
  );
}

export default Profile;
