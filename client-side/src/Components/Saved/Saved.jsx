import React, { useState, useEffect, useContext } from "react";
import "./Saved.css";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { userContext } from "./../../ContextApi/UserContext/UserContext";

function Saved({ saved }) {
  const [photo, setPhoto] = useState(false);
  const { user } = useContext(userContext);

  useEffect(() => {
    if (saved?.img.split(/[#?]/)[0].split(".").pop().trim() !== "mp4") {
      setPhoto(true);
    }
  }, [saved?.img]);

  return (
    <div className="actualSavedPostsContainer">
      <div className="actualSavedPostsWrapper">
        <div className="SavedPostImageOrVideo">
          {saved?.img.split(/[#?]/)[0].split(".").pop().trim() !== "mp4" ? (
            <img className="savedPostImg" src={saved?.img} alt="" />
          ) : (
            <video
              src={saved?.img}
              poster={saved?.videoSnap}
              controls
              className="savedPostImg"
            ></video>
          )}
        </div>
        <div className="savedPostInfo">
          <h2 className="savedPostTitle">{saved?.description}</h2>
          <span className="whatSaved">
            {photo ? "Photo.saved" : "Video.saved"}
          </span>
          <div className="savedPostImageAndSource">
            <img src={saved?.userPhoto} alt="" className="UserPostImg" />
            <span className="sourceSavedFrom">
              {saved?.username === user?.username
                ? "Your Post"
                : `saved from ${saved?.username}`}
            </span>
          </div>
          <div className="addToCollections">
            <button className="collections">Add to Colection </button>
            <div className="share">
              <ReplyOutlinedIcon style={{ fontSize: 50 }} />
            </div>
            <div className="morevertContainerrr">
              <div className="moreVet">
                <MoreHorizOutlinedIcon style={{ fontSize: 50 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Saved;
