import React, { useEffect, useState } from "react";
import "./ChatBox.css";
import { format } from "timeago.js";
import axiosInstance from "./../../axios";

function ChatBox({ own, message, loggedInUser }) {
  const [sender, setSender] = useState({});
  //get SenderInfo and extract profilePic

  const senderId = message.senderId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const GetSenderInfo = async () => {
      try {
        const res = await axiosInstance.get("users/" + senderId);
        setSender(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetSenderInfo();
  }, [senderId]);

  return (
    <div className={own ? "chatBox own" : "chatBox"}>
      <div className="imageAndText">
        {own ? (
          <img
            src={
              loggedInUser.profilePic ||
              "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
            }
            alt=""
            className="chatBoxImg"
          />
        ) : (
          <img
            src={
              sender.profilePic ||
              "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
            }
            alt=""
            className="chatBoxImg"
          />
        )}
        <span className={own ? "chatBoxText own" : "chatBoxText"}>
          {message.text}
        </span>
      </div>
      <span className="chatBoxtimeStamp">{format(message.createdAt)}</span>
    </div>
  );
}

export default ChatBox;
