import React, { useEffect, useState, useContext } from "react";
import "./Comments.css";
import { useHistory } from "react-router-dom";
import { format } from "timeago.js";
import Reply from "./../Replies/Reply";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "./../../axios";

function Comments({ comment, setNumOfComments, socket }) {
  const [user, setUser] = useState({});
  const [showFirstReply, setShowFirstReply] = useState(false);
  const [typeReply, setTypeReply] = useState(false);
  const [text, setText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState([]);
  const [postImg, setPostImg] = useState({});
  const [postSnapVideo, setPostSnapVideo] = useState({});
  const history = useHistory();

  const { user: loggedInUser } = useContext(userContext);

  //Get User who commented anytime this page renders
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("users/" + comment?.userId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment?.userId]);

  //Get singlePostImg by its id
  useEffect(() => {
    const getSinglePost = async () => {
      const res = await axiosInstance.get("posts/" + comment?.postId);
      setPostImg(res.data.img);
      setPostSnapVideo(res.data.videoSnap);
    };
    getSinglePost();
  }, [comment?.postId]);

  const handlePageLoad = () => {
    history.push(`/profile/${user?._id}`);
  };

  const handleShowReply = () => {
    setShowFirstReply(true);
  };

  //Fetch replies anytime this component mounts
  useEffect(() => {
    const getReply = async () => {
      const res = await axiosInstance.get("reply/" + comment?._id);
      setReplies(res.data);
    };
    getReply();
  }, [comment?._id]);

  //Post a reply
  const handlePost = async (type) => {
    setReplying(true);
    const details = {
      commentId: comment?._id,
      postId: comment?.postId,
      userId: loggedInUser?._id,
      text,
    };

    try {
      const res = await axiosInstance.post("reply", details);
      setTimeout(() => {
        setReplies((prev) => [...prev, res.data]);
      }, 5000);

      // update reply Array in commentSchema
      await axiosInstance.put("reply/reply/" + comment?._id, {
        replyId: res.data._id,
      });

      //update comments array in postSchema
      await axiosInstance.put("comments/comment/" + comment?.postId, {
        commentId: res.data._id,
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
        receiverId: comment?.userId,
        postId: comment?.postId,
        postPhoto: postImg,
        postVideo: postSnapVideo,
        type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {comment?.text ? (
        <div className="displayCommentsWrapper">
          <img
            onClick={handlePageLoad}
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
                <span
                  style={{ fontWeight: 500, cursor: "pointer" }}
                  onClick={handlePageLoad}
                >
                  {user?.username}
                </span>
                <span
                  style={{ marginLeft: "15px", fontWeight: 500, opacity: 0.6 }}
                >
                  {format(comment?.createdAt)}
                </span>
              </div>
              <span style={{ marginTop: "2px" }}>{comment?.text}</span>
            </div>
            <div className="LinkeAndReplyWrapper">
              <div className="LikeAndReply">
                <span className="reply" onClick={() => setTypeReply(true)}>
                  reply
                </span>
                <span className="numOfReplies" onClick={handleShowReply}>
                  {replies.length > 0 && replies.length}{" "}
                  {replies.length === 1 && "reply"}
                  {replies.length > 1 && "replies"}
                </span>
              </div>
              {typeReply && (
                <form className="replyForm">
                  <input
                    type="text"
                    className="replyInput"
                    placeholder={`Reply to ${user?.username}`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="postReply" onClick={() => handlePost(3)}>
                    {replying ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      " Post"
                    )}
                  </div>
                </form>
              )}
              {showFirstReply && (
                <>
                  {replies?.map((r) => (
                    <Reply
                      socket={socket}
                      reply={r}
                      key={r._id}
                      setNumOfComments={setNumOfComments}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Comments;
