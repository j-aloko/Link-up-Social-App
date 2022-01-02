import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import axiosInstance from "./../../axios";

function Reply3({ thirdReply }) {
  const [user, setUser] = useState({});

  //fetch User who  made the third reply

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get("users/" + thirdReply?.userId);
      setUser(res.data);
    };
    fetchUser();
  }, [thirdReply?.userId]);

  return (
    <div className="displayReplyWrapper">
      <img
        src={
          user?.profilePic ||
          "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
        }
        alt=""
        className="usersImage"
      />
      <div className="usernameAndCommentWrapper">
        <div className="usersNameAndComment">
          <div className="usernameAndTimestamp">
            <span style={{ fontWeight: 500, cursor: "pointer" }}>
              {user?.username}
            </span>
            <span style={{ marginLeft: "15px", fontWeight: 500, opacity: 0.6 }}>
              {format(thirdReply?.createdAt)}
            </span>
          </div>
          <span style={{ marginTop: "2px" }}>{thirdReply?.text}</span>
        </div>
      </div>
    </div>
  );
}

export default Reply3;
