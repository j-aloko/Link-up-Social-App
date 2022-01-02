import React, { useContext } from "react";
import "./Right.css";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import Online from "./../OnlineFriends/Online";

function Right({ onlineUsers }) {
  const { user } = useContext(userContext);

  return (
    <div className="rightContainer">
      <div className="rightWrapper">
        <div className="birthdayWrapper">
          <img
            className="birthdayImage"
            src="https://img.icons8.com/color-glass/48/000000/birthday.png"
            alt=""
          />
          <span>
            <b>{user.username}</b> and <b>3 other friends</b> have birthdays
            today
          </span>
        </div>
        <img
          src="https://images.unsplash.com/photo-1559056419-266cbf698202?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
          alt=""
          className="rightImage"
        />
      </div>
      {onlineUsers?.length > 0 && (
        <div className="onlineFriends">
          <h5>Online Friends</h5>
          {onlineUsers?.map((onlineUser, index) => (
            <Online onlineUser={onlineUser} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Right;
