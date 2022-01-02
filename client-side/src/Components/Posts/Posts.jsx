import React, { useEffect, useState } from "react";
import "./Posts.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import Comments from "./../Comments/Comments";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MoreVert from "./../MoreVertItems/MoreVert";
import axiosInstance from "./../../axios";

function Posts({ post, socket }) {
  const [count, setCount] = useState(post?.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [youLiked, setYouLiked] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState(null);
  const [numOfComments, setNumOfComments] = useState(post?.comments.length);
  const [user, setUser] = useState({});
  const [openMoreOptions, setOpenMoreOptions] = useState(false);

  //Instant Comments
  useEffect(() => {
    socket?.on("receiveComments", (data) => {
      setNewComments({
        text: data.text,
        postId: data.postId,
        userId: data.userId,
        createdAt: Date.now(),
      });
      setNumOfComments((prevNumOfComments) => prevNumOfComments + 1);
    });
  }, [socket]);

  useEffect(() => {
    newComments &&
      newComments.postId === post?._id &&
      setComments((prev) => [...prev, newComments]);
  }, [newComments, post?._id]);

  //Get Single User
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("users/" + post?.userId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [post?.userId]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const likes = post?.likes;

  //Verifying that the current user has already liked this post
  useEffect(() => {
    setIsLiked(likes && likes.includes(loggedInUser?._id));
    setYouLiked(true);
  }, [likes, loggedInUser?._id]);

  //Handling likes
  const handleCount = async (type) => {
    setIsLiked(true);
    if (isLiked) {
      setCount((prevCount) => prevCount - 1);
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setCount((prevCount) => prevCount + 1);
      socket?.emit("Notification", {
        senderName: loggedInUser?.username,
        senderId: loggedInUser?._id,
        profilePic: loggedInUser?.profilePic,
        receiverId: post?.userId,
        postId: post?._id,
        postPhoto: post?.img,
        postVideo: post?.videoSnap,
        type,
      });
    }

    try {
      await axiosInstance.put("posts/like/" + post._id, {
        userId: JSON.parse(localStorage.getItem("user"))._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* Algorithm to Verify the url extension
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }*/

  const handlePostComment = async (type) => {
    const Info = {
      text,
      postId: post?._id,
      userId: loggedInUser._id,
    };

    //Initiating real time comment dispaly
    socket?.emit("comments", {
      text,
      postId: post?._id,
      userId: loggedInUser._id,
    });

    try {
      const res = await axiosInstance.post("comments", Info);
      setComments([...comments, res.data]);
    } catch (error) {
      console.log(error);
    }
    try {
      await axiosInstance.put("posts/comment/" + post?._id, {
        text: text,
      });
      //Send Notification
      socket?.emit("Notification", {
        senderName: loggedInUser?.username,
        senderId: loggedInUser?._id,
        profilePic: loggedInUser?.profilePic,
        receiverId: post?.userId,
        postId: post?._id,
        postPhoto: post?.img,
        postVideo: post?.videoSnap,
        type,
      });
    } catch (error) {
      console.log(error);
    }
    setText("");
  };

  //Fetch All comments the minute this page renders
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axiosInstance.get("comments/" + post?._id);
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [post?._id]);

  return (
    <div className="feedPost">
      <div className="postInfo">
        <div className="feedImageNameTimeIcon">
          <div className="feedImageNameTime">
            <Link to={`/profile/${user._id}`} className="links">
              {user?.profilePic ? (
                <img src={user?.profilePic} alt="" className="feedImage" />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  alt=""
                  className="feedImage"
                />
              )}
              <span style={{ cursor: "pointer", marginLeft: "15px" }}>
                {user.username}
              </span>
            </Link>
            <span style={{ opacity: "0.6" }}>{format(post?.createdAt)}</span>
          </div>
          <div
            className="MorevertMainContainer"
            onClick={() => setOpenMoreOptions(!openMoreOptions)}
          >
            <MoreVertIcon style={{ cursor: "pointer" }} />
          </div>
        </div>
        <div className="caption">
          <span className="postCaption">{post?.description}</span>
          <div className="PostImageOrVideoWrapper">
            {openMoreOptions && (
              <div className="moreOptions">
                <MoreVert user={user} post={post} />
              </div>
            )}
            {post?.img.split(/[#?]/)[0].split(".").pop().trim() !== "mp4" ? (
              <img src={post?.img} alt="" className="postImage" />
            ) : (
              <video
                src={post?.img}
                controls
                preload="auto"
                poster={post?.videoSnap}
                className="postImage"
              ></video>
            )}
          </div>
        </div>
        <div className="likeAndComment">
          <div className="likeAndCount">
            {isLiked ? (
              <ThumbUpIcon style={{ color: "blue" }} onClick={handleCount} />
            ) : (
              <ThumbUpAltOutlinedIcon
                style={{ color: "blue" }}
                onClick={() => handleCount(1)}
              />
            )}
            {isLiked ? (
              <FavoriteOutlinedIcon
                style={{ color: "red", marginLeft: "10px" }}
                onClick={() => handleCount(1)}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                style={{ color: "red", marginLeft: "10px" }}
                onClick={() => handleCount(1)}
              />
            )}
            <span style={{ marginLeft: "10px" }}>
              {count} {count > 1 ? "Likes" : "Like"}
            </span>
          </div>
          <span
            className="numberOfComments"
            onClick={() => setDisplayComments(true)}
          >
            <ChatBubbleOutlineOutlinedIcon />
            {numOfComments > 0 && numOfComments}{" "}
            {numOfComments <= 1 ? "comment" : "comments"}
          </span>
        </div>
        {isLiked && youLiked ? (
          <span style={{ marginTop: "5px" }}>You liked this post</span>
        ) : null}
      </div>
      {displayComments ? (
        <>
          <div
            className="closeCommentsTab"
            onClick={() => setDisplayComments(false)}
          >
            <CloseOutlinedIcon />
          </div>
          <div className="commentWrapper">
            <div className="commentAndPostWrapper">
              <img
                src={
                  loggedInUser.profilePic ||
                  "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                }
                alt=""
                className="usersImage"
              />
              <textarea
                type="text"
                className="commentInput"
                placeholder="Write a comment...."
                autoFocus={true}
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              <span
                className="postComment"
                onClick={() => handlePostComment(2)}
              >
                Post
              </span>
            </div>
          </div>
          <div className="commentContainer">
            {comments?.map((comment) => (
              <Comments
                socket={socket}
                comment={comment}
                key={comment?._id}
                numOfComments={numOfComments}
                setNumOfComments={setNumOfComments}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Posts;
