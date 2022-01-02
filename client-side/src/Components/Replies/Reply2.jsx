import React, { useState, useEffect, useContext } from "react";
import { format } from "timeago.js";
import Reply3 from "./Reply3";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "./../../axios";

function Reply2({ secondReply, setNumOfComments, socket }) {
  const [typeReply, setTypeReply] = useState(false);
  const [showThirdReply, setShowThirdReply] = useState(false);
  const [user, setUser] = useState({});
  const [thirdReplies, setThirdReplies] = useState(false);
  const [text, setText] = useState("");
  const [replying, setReplying] = useState(false);
  const { user: loggedInUser } = useContext(userContext);
  const [postImg, setPostImg] = useState({});
  const [postSnapVideo, setPostSnapVideo] = useState({});

  //fetch second user who made the second reply
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get("users/" + secondReply?.userId);
      setUser(res.data);
    };
    fetchUser();
  }, [secondReply?.userId]);

  //Get singlePostImg by its id
  useEffect(() => {
    const getSinglePost = async () => {
      const res = await axiosInstance.get("posts/" + secondReply?.postId);
      setPostImg(res.data.img);
      setPostSnapVideo(res.data.videoSnap);
    };
    getSinglePost();
  }, [secondReply?.postId]);

  //fetch Third replies when this component mounts
  useEffect(() => {
    const getReply = async () => {
      const res = await axiosInstance.get("reply3/" + secondReply?._id);
      setThirdReplies(res.data);
    };
    getReply();
  }, [secondReply?._id]);

  //Post third reply
  const handlePost = async (type) => {
    setReplying(true);
    const details = {
      reply2Id: secondReply?._id,
      postId: secondReply?.postId,
      userId: loggedInUser?._id,
      text,
    };

    try {
      const res = await axiosInstance.post("reply3", details);
      setTimeout(() => {
        setThirdReplies((prev) => [...prev, res.data]);
      }, 5000);

      //update comments array in postSchema
      await axiosInstance.put("comments/comment/" + secondReply?.postId, {
        commentId: res.data?._id,
      });
      setReplying(false);
      setTypeReply(false);
      setText("");
      setNumOfComments((prevNumOfComments) => prevNumOfComments + 1);

      //Send Notification
      socket?.emit("Notification", {
        senderName: loggedInUser?.username,
        senderId: loggedInUser?._id,
        profilePic: loggedInUser?.profilePic,
        receiverId: secondReply?.userId,
        postId: secondReply?.postId,
        postPhoto: postImg,
        postVideo: postSnapVideo,
        type,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
              {format(secondReply?.createdAt)}
            </span>
          </div>
          <span style={{ marginTop: "2px" }}>{secondReply?.text}</span>
        </div>
        <div className="LinkeAndReply">
          <span className="reply" onClick={() => setTypeReply(true)}>
            reply
          </span>
          <span
            className="numOfReplies"
            onClick={() => setShowThirdReply(true)}
          >
            {thirdReplies.length > 0 && thirdReplies.length}{" "}
            {thirdReplies.length === 1 && "reply"}
            {thirdReplies.length > 1 && "replies"}
          </span>
        </div>
        {typeReply && (
          <form className="replyForm">
            <input
              type="text"
              className="replyInput"
              value={text}
              placeholder={`Reply to ${user?.username}`}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="postReply" onClick={() => handlePost(3)}>
              {replying ? <CircularProgress color="secondary" /> : " Post"}
            </div>
          </form>
        )}
        {showThirdReply && (
          <>
            {thirdReplies?.map((tr) => (
              <Reply3 key={tr?._id} thirdReply={tr} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Reply2;
