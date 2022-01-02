import React, { useContext, useState, useEffect, useRef } from "react";
import "./Messenger.css";
import Conversation from "./../../Components/Conversation/Conversation";
import ChatBox from "./../../Components/ChatBox/ChatBox";
import Online from "./../../Components/OnlineFriends/Online";
import { conversationContext } from "./../../ContextApi/FetchConversation/ContextApi";
import {
  fetchConversationStart,
  fetchConversationSuccess,
  fetchConversationFailure,
} from "./../../ContextApi/FetchConversation/Actions";
import { fetchMessagesContext } from "./../../ContextApi/FetchMessages/ContextApi";
import Skeleton from "@mui/material/Skeleton";
import axiosInstance from "./../../axios";

function Messenger({ socket, onlineUsers }) {
  const [chat, setChat] = useState(null);

  const [newMessage, setNewMessage] = useState(null);

  const [messages, setMessages] = useState([]);

  const [typedMessage, setTypedMessage] = useState("");

  const [friendsSocketId, setFriendsSocketId] = useState();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const { dispatch, conversations } = useContext(conversationContext);

  const { isFetching } = useContext(fetchMessagesContext);

  const scrollRef = useRef();

  //Connecting to socket server
  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      setNewMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  //Get new Message then rendering it in our jsx

  useEffect(() => {
    newMessage &&
      chat?.members.includes(newMessage.senderId) &&
      setMessages((prev) => [...prev, newMessage]);
  }, [newMessage, chat]);

  //Sending userId to the socket server and receiving socketIds of each user back from the server
  useEffect(() => {
    const receiverId = chat?.members.find(
      (member) => member !== loggedInUser._id
    );
    const receiver = onlineUsers?.find((user) => user.userId === receiverId);
    setFriendsSocketId(receiver?.socketId);
  }, [chat?.members, loggedInUser._id, onlineUsers]);

  //Fetching Conversations with context Api
  useEffect(() => {
    const FetchConversations = async () => {
      try {
        dispatch(fetchConversationStart());
        const res = await axiosInstance.get("conversation/" + loggedInUser._id);
        dispatch(fetchConversationSuccess(res.data));
      } catch (error) {
        dispatch(fetchConversationFailure());
      }
    };
    FetchConversations();
  }, [dispatch, loggedInUser._id]);

  //fetching Messages with context api
  useEffect(() => {
    const FetchMessages = async () => {
      try {
        const res = await axiosInstance.get("message/" + chat?._id);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    FetchMessages();
  }, [chat]);

  //Sending a message to other users
  const handleSend = async (e) => {
    e.preventDefault();
    const textMessage = {
      conversationId: chat?._id,
      senderId: loggedInUser._id,
      text: typedMessage,
    };

    socket?.emit("message", {
      senderId: loggedInUser._id,
      friendsSocketId,
      text: typedMessage,
    });

    socket?.emit("SMS", {
      friendsSocketId,
      senderId: loggedInUser._id,
      num: 1,
    });

    try {
      const res = await axiosInstance.post("message", textMessage);
      setMessages([...messages, res.data]);
      setTypedMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messenger">
        <div className="conversationWrapper">
          <input
            type="text"
            className="searchFriends"
            placeholder="Search for friends...."
            autoFocus={true}
          />
          <h4 className="converationss">Conversations</h4>
          {conversations.map((conversation) => (
            <div key={conversation._id} onClick={() => setChat(conversation)}>
              <Conversation
                socket={socket}
                conversation={conversation}
                loggedInUser={loggedInUser}
              />
            </div>
          ))}
        </div>
        <div className="ChatAreaWrapper">
          {chat ? (
            <>
              <div className="chatBoxxx">
                {isFetching ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <>
                    {messages?.map((message) => (
                      <div key={message._id} ref={scrollRef}>
                        <ChatBox
                          message={message}
                          own={loggedInUser._id === message.senderId}
                          loggedInUser={loggedInUser}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="textAreaAndButton">
                <textarea
                  className="typeText"
                  placeholder="Say Hi to Your friends.."
                  value={typedMessage}
                  autoFocus={true}
                  onChange={(e) => setTypedMessage(e.target.value)}
                ></textarea>
                <button className="sendMessage" onClick={handleSend}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="openAChat">
              Open a Conversation to Start a Chat
            </span>
          )}
        </div>
        <div className="onlineWrapper">
          {onlineUsers?.map((onlineUser, index) => (
            <Online onlineUser={onlineUser} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Messenger;
