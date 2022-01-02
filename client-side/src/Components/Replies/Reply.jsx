import React, { useState, useEffect, useContext } from "react";
import "./Reply.css";
import Reply2 from "./Reply2";
import { format } from "timeago.js";
import CircularProgress from "@mui/material/CircularProgress";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import axiosInstance from "./../../axios";

function Reply({ reply, setNumOfComments, socket }) {
  const [typeReply, setTypeReply] = useState(false);
  const [showSecondReply, setShowSecondReply] = useState(false);
  const [user, setUser] = useState({});
  const [secondReplies, setSecondReplies] = useState([]);
  const [text, setText] = useState("");
  const [replying, setReplying] = useState(false);
  const [postImg, setPostImg] = useState({});
  const [postSnapVideo, setPostSnapVideo] = useState({});
  const { user: loggedInUser } = useContext(userContext);

  //Anytime this component mounts, fetch User who replied
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get("users/" + reply?.userId);
      setUser(res.data);
    };
    fetchUser();
  }, [reply?.userId]);

  //Get singlePostImg by its id
  useEffect(() => {
    const getSinglePost = async () => {
      const res = await axiosInstance.get("posts/" + reply?.postId);
      setPostImg(res.data.img);
      setPostSnapVideo(res.data.videoSnap);
    };
    getSinglePost();
  }, [reply?.postId]);

  //fetch Second reply if this component mounts
  useEffect(() => {
    const getReply = async () => {
      const res = await axiosInstance.get("reply2/" + reply?._id);
      setSecondReplies(res.data);
    };
    getReply();
  }, [reply?._id]);

  //Post second Reply
  const handlePost = async (type) => {
    setReplying(true);
    const details = {
      replyId: reply?._id,
      postId: reply?.postId,
      userId: loggedInUser?._id,
      text,
    };

    try {
      const res = await axiosInstance.post("reply2", details);
      setTimeout(() => {
        setSecondReplies((prev) => [...prev, res.data]);
      }, 5000);

      // update reply2 Array in ReplySchema
      await axiosInstance.put("reply2/reply2/" + reply?._id, {
        reply2Id: res.data?._id,
      });

      //update comments array in postSchema
      await axiosInstance.put("comments/comment/" + reply?.postId, {
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
        receiverId: reply?.userId,
        postId: reply?.postId,
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
              {format(reply?.createdAt)}
            </span>
          </div>
          <span style={{ marginTop: "2px" }}>{reply?.text}</span>
        </div>
        <div className="LinkeAndReply">
          <span className="reply" onClick={() => setTypeReply(true)}>
            reply
          </span>
          <span
            className="numOfReplies"
            onClick={() => setShowSecondReply(true)}
          >
            {secondReplies.length > 0 && secondReplies.length}{" "}
            {secondReplies.length === 1 && "reply"}
            {secondReplies.length > 1 && "replies"}
          </span>
        </div>
        {typeReply && (
          <form className="replyForm">
            <input
              type="text"
              className="replyInput"
              placeholder={`Reply to ${user?.username}`}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="postReply" onClick={() => handlePost(3)}>
              {replying ? <CircularProgress color="secondary" /> : " Post"}
            </div>
          </form>
        )}
        {showSecondReply && (
          <>
            {secondReplies?.map((sr) => (
              <Reply2
                socket={socket}
                key={sr?._id}
                secondReply={sr}
                setNumOfComments={setNumOfComments}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Reply;
