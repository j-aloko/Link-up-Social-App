import React, { useState, useContext } from "react";
import "./MoreVert.css";
import LinkIcon from "@mui/icons-material/Link";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import axiosInstance from "./../../axios";

function MoreVert({ user, post }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user: loggedInUser } = useContext(userContext);

  //Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(post?.img);
    setCopied(true);
  };

  //HandleSavedPosts
  const handleSave = async () => {
    const postInfo = {
      postId: post?._id,
      userId: loggedInUser?._id,
      username: user?.username,
      userPhoto: user?.profilePic,
      description: post?.description,
      img: post?.img,
      videoSnap: post?.videoSnap,
    };
    try {
      await axiosInstance.post("savedPosts", postInfo);
      setSaved(true);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDeletePost = () => {
    const deletePost = async () => {
      try {
        await axiosInstance.delete("posts/" + post?._id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
    deletePost();
  };

  return (
    <div className="morevertContainer">
      <div className="morevertWrapper">
        <div className="ItemWrapper" onClick={handleCopyLink}>
          <>
            {copied ? (
              <CheckOutlinedIcon style={{ fontSize: 30 }} />
            ) : (
              <LinkIcon style={{ fontSize: 30 }} />
            )}
          </>
          <span className="itemNames">
            {copied ? "Link copied" : "Copy link"}
          </span>
        </div>
        <div className="ItemWrapper" onClick={handleSave}>
          <>
            {saved ? (
              <BookmarkAddedOutlinedIcon style={{ fontSize: 30 }} />
            ) : (
              <BookmarkAddOutlinedIcon style={{ fontSize: 30 }} />
            )}
          </>
          <span className="itemNames">{saved ? "Saved" : "Save"}</span>
        </div>
        {user?._id === loggedInUser?._id && (
          <div className="ItemWrapper" onClick={HandleDeletePost}>
            <DeleteOutlineOutlinedIcon style={{ fontSize: 30 }} />
            <span className="itemNames">Delete</span>
          </div>
        )}
        <div className="ItemWrapper">
          <PriorityHighOutlinedIcon style={{ fontSize: 30 }} />
          <span className="itemNames">Report</span>
        </div>
      </div>
    </div>
  );
}

export default MoreVert;
