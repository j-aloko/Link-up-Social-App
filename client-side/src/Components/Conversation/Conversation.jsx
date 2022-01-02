import React, { useEffect, useState } from "react";
import "./Conversation.css";
import Badge from "@mui/material/Badge";
import axiosInstance from "./../../axios";

function Conversation({ conversation, loggedInUser, socket }) {
  const [friend, setFriend] = useState([]);
  const [count, setCount] = useState(0);

  //Extracting friends Id anytime the page rednders
  const friendId = conversation.members.find((c) => c !== loggedInUser._id);

  //Now We can get friendsInfo
  useEffect(() => {
    const GetFriendsInfo = async () => {
      try {
        const res = await axiosInstance.get("users/" + friendId);
        setFriend(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetFriendsInfo();
  }, [friendId]);

  //Receive SMS from socket
  useEffect(() => {
    setTimeout(() => {
      socket?.on("receiveSMS", (data) => {
        if (friend?._id === data?.senderId) {
          setCount((prevCount) => prevCount + data.num);
        }
      });
    }, 3000);
  }, [socket, friend?._id]);

  return (
    <div className="conversation" onClick={() => setCount(0)}>
      <div className="conversationUserImageAndName">
        <img
          src={
            friend?.profilePic ||
            "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
          }
          alt=""
          className="conversationImg"
        />
        <span className="usernamee">{friend?.username}</span>
      </div>
      {count > 0 && <Badge badgeContent={count} color="success"></Badge>}
    </div>
  );
}

export default Conversation;
